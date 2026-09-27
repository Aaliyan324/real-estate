import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { PropertyPurpose, PropertyType, AreaUnit, FurnishingStatus, PropertyStatus, Prisma } from '@prisma/client'

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const skip = (page - 1) * limit

    const purpose = searchParams.get('purpose') as PropertyPurpose | null
    const propertyType = searchParams.get('type') as PropertyType | null
    const city = searchParams.get('city')
    const area = searchParams.get('area')
    const query = searchParams.get('query')
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!, 10) : undefined
    const bathrooms = searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!, 10) : undefined
    const minArea = searchParams.get('minArea') ? parseFloat(searchParams.get('minArea')!) : undefined
    const maxArea = searchParams.get('maxArea') ? parseFloat(searchParams.get('maxArea')!) : undefined
    const isFeatured = searchParams.get('featured') === 'true' ? true : undefined
    const isVerified = searchParams.get('verified') === 'true' ? true : undefined
    const statusParam = searchParams.get('status') as PropertyStatus | null
    const sort = searchParams.get('sort') || 'newest'

    // Public API defaults to PUBLISHED unless admin specifies status
    const where: Prisma.PropertyWhereInput = {
      status: statusParam || PropertyStatus.PUBLISHED,
    }

    if (purpose) where.purpose = purpose
    if (propertyType) where.propertyType = propertyType
    if (isFeatured) where.isFeatured = true
    if (isVerified) where.isVerified = true

    if (city) {
      where.city = { contains: city }
    }
    if (area) {
      where.area = { contains: area }
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { city: { contains: query } },
        { area: { contains: query } },
        { society: { contains: query } },
        { address: { contains: query } },
      ]
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    if (bedrooms !== undefined && bedrooms > 0) {
      where.bedrooms = { gte: bedrooms }
    }

    if (bathrooms !== undefined && bathrooms > 0) {
      where.bathrooms = { gte: bathrooms }
    }

    if (minArea !== undefined || maxArea !== undefined) {
      where.areaSize = {}
      if (minArea !== undefined) where.areaSize.gte = minArea
      if (maxArea !== undefined) where.areaSize.lte = maxArea
    }

    let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { price: 'asc' }
    if (sort === 'price_desc') orderBy = { price: 'desc' }
    if (sort === 'oldest') orderBy = { createdAt: 'asc' }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          features: true,
          agent: {
            select: {
              id: true,
              name: true,
              slug: true,
              agency: true,
              phone: true,
              whatsapp: true,
              photo: true,
              isVerified: true,
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ])

    return NextResponse.json({
      properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Fetch properties error:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      title,
      description,
      purpose,
      propertyType,
      price,
      city,
      area,
      society,
      address,
      bedrooms,
      bathrooms,
      areaSize,
      areaUnit,
      furnishing,
      parking,
      isFeatured,
      isVerified,
      status,
      latitude,
      longitude,
      images,
      features,
      agentId,
    } = body

    if (!title || !description || !price || !city || !area || !address) {
      return NextResponse.json({ error: 'Missing required property fields' }, { status: 400 })
    }

    const slugBase = slugify(title)
    let slug = slugBase
    let counter = 1
    while (await prisma.property.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${counter}`
      counter++
    }

    const newProperty = await prisma.property.create({
      data: {
        title,
        slug,
        description,
        purpose: purpose as PropertyPurpose || PropertyPurpose.FOR_SALE,
        propertyType: propertyType as PropertyType || PropertyType.HOUSE,
        price: parseFloat(price),
        city,
        area,
        society: society || null,
        address,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : 0,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : 0,
        areaSize: parseFloat(areaSize || 0),
        areaUnit: areaUnit as AreaUnit || AreaUnit.MARLA,
        furnishing: furnishing as FurnishingStatus || FurnishingStatus.UNFURNISHED,
        parking: Boolean(parking),
        isFeatured: Boolean(isFeatured),
        isVerified: Boolean(isVerified),
        status: status as PropertyStatus || PropertyStatus.PUBLISHED,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        userId: session.id,
        agentId: agentId || session.agentId || null,
        images: {
          create: Array.isArray(images)
            ? images.map((url: string, index: number) => ({
                url,
                isMain: index === 0,
                sortOrder: index,
              }))
            : [],
        },
        features: {
          create: Array.isArray(features)
            ? features.map((name: string) => ({ name }))
            : [],
        },
      },
      include: {
        images: true,
        features: true,
      },
    })

    return NextResponse.json({ success: true, property: newProperty })
  } catch (error) {
    console.error('Create property error:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
