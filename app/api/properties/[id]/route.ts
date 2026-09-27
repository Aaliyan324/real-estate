import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const property = await prisma.property.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
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
            email: true,
            phone: true,
            whatsapp: true,
            agency: true,
            agencyLogo: true,
            bio: true,
            photo: true,
            isVerified: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Fetch property error:', error)
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    const existingProperty = await prisma.property.findUnique({
      where: { id },
    })

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

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

    // Update main fields
    await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        purpose,
        propertyType,
        price: price !== undefined ? parseFloat(price) : undefined,
        city,
        area,
        society,
        address,
        bedrooms: bedrooms !== undefined ? parseInt(bedrooms, 10) : undefined,
        bathrooms: bathrooms !== undefined ? parseInt(bathrooms, 10) : undefined,
        areaSize: areaSize !== undefined ? parseFloat(areaSize) : undefined,
        areaUnit,
        furnishing,
        parking: parking !== undefined ? Boolean(parking) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        isVerified: isVerified !== undefined ? Boolean(isVerified) : undefined,
        status,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        agentId: agentId || undefined,
      },
    })

    // If new images provided, update relations
    if (Array.isArray(images)) {
      await prisma.propertyImage.deleteMany({ where: { propertyId: id } })
      await prisma.propertyImage.createMany({
        data: images.map((url: string, index: number) => ({
          propertyId: id,
          url,
          isMain: index === 0,
          sortOrder: index,
        })),
      })
    }

    // If new features provided, update relations
    if (Array.isArray(features)) {
      await prisma.propertyFeature.deleteMany({ where: { propertyId: id } })
      await prisma.propertyFeature.createMany({
        data: features.map((name: string) => ({
          propertyId: id,
          name,
        })),
      })
    }

    const updated = await prisma.property.findUnique({
      where: { id },
      include: { images: true, features: true, agent: true },
    })

    return NextResponse.json({ success: true, property: updated })
  } catch (error) {
    console.error('Update property error:', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    await prisma.property.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
