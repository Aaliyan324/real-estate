import { NextResponse } from 'next/server'
import { propertyRepository } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { PropertyPurpose, PropertyType, AreaUnit, FurnishingStatus, PropertyStatus } from '@prisma/client'

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

    // Public API defaults to PUBLISHED unless admin specifies status.
    const { properties, pagination } = await propertyRepository.list({
      page,
      limit,
      purpose,
      propertyType,
      city,
      area,
      query,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      isFeatured,
      isVerified,
      status: statusParam,
      sort,
    })

    return NextResponse.json({ properties, pagination })
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
    while (await propertyRepository.getBySlug(slug)) {
      slug = `${slugBase}-${counter}`
      counter++
    }

    const newProperty = await propertyRepository.create({
      title,
      slug,
      description,
      purpose: (purpose as PropertyPurpose) || PropertyPurpose.FOR_SALE,
      propertyType: (propertyType as PropertyType) || PropertyType.HOUSE,
      price: parseFloat(price),
      city,
      area,
      society: society || null,
      address,
      bedrooms: bedrooms ? parseInt(bedrooms, 10) : 0,
      bathrooms: bathrooms ? parseInt(bathrooms, 10) : 0,
      areaSize: parseFloat(areaSize || 0),
      areaUnit: (areaUnit as AreaUnit) || AreaUnit.MARLA,
      furnishing: (furnishing as FurnishingStatus) || FurnishingStatus.UNFURNISHED,
      parking: Boolean(parking),
      isFeatured: Boolean(isFeatured),
      isVerified: Boolean(isVerified),
      status: (status as PropertyStatus) || PropertyStatus.PUBLISHED,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      userId: session.id,
      agentId: agentId || session.agentId || null,
      imageUrls: Array.isArray(images) ? images : [],
      featureNames: Array.isArray(features) ? features : [],
    })

    return NextResponse.json({ success: true, property: newProperty })
  } catch (error) {
    console.error('Create property error:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
