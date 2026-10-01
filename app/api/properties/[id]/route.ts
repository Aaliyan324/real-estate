import { NextResponse } from 'next/server'
import { propertyRepository } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const property = await propertyRepository.getByIdOrSlug(id)

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
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    const existingProperty = await propertyRepository.findUnique(id)

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Authorization & Ownership Verification (Fix IDOR)
    const isOwner = existingProperty.userId === session.id
    const isAssignedAgent = Boolean(session.agentId && existingProperty.agentId === session.agentId)
    const isAdmin = session.role === 'ADMIN'

    if (!isAdmin && !isOwner && !isAssignedAgent) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to modify this property' }, { status: 403 })
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
    await propertyRepository.update(id, {
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
      isFeatured: isAdmin ? (isFeatured !== undefined ? Boolean(isFeatured) : undefined) : undefined,
      isVerified: isAdmin ? (isVerified !== undefined ? Boolean(isVerified) : undefined) : undefined,
      status,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      agentId: isAdmin ? (agentId || undefined) : undefined,
    })

    // If new images provided, update relations
    if (Array.isArray(images)) {
      await propertyRepository.replaceImages(id, images)
    }

    // If new features provided, update relations
    if (Array.isArray(features)) {
      await propertyRepository.replaceFeatures(id, features)
    }

    const updated = await propertyRepository.getWithRelations(id)

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
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const { id } = await params

    const existingProperty = await propertyRepository.findUnique(id)

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Authorization & Ownership Verification (Fix IDOR)
    const isOwner = existingProperty.userId === session.id
    const isAssignedAgent = Boolean(session.agentId && existingProperty.agentId === session.agentId)
    const isAdmin = session.role === 'ADMIN'

    if (!isAdmin && !isOwner && !isAssignedAgent) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this property' }, { status: 403 })
    }

    await propertyRepository.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
