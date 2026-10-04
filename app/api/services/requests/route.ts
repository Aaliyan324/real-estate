import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceRequestRepository } from '@/lib/db'
import { prisma } from '@/lib/db/client'
import { ServiceRequestStatus } from '@prisma/client'

function generateRequestNumber() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SR-${ts}-${rand}`
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status') as ServiceRequestStatus | null

    const requests = await serviceRequestRepository.findForCustomer(user.id)
    const filtered = statusParam ? requests.filter((r) => r.status === statusParam) : requests

    return NextResponse.json({ success: true, requests: filtered })
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json({ error: 'Failed to load requests' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized — please login to submit a request.' }, { status: 401 })
    }

    const body = await request.json()
    const {
      categoryId,
      subcategoryId,
      title,
      description,
      urgency,
      provinceId,
      districtId,
      cityId,
      areaId,
      city,
      area,
      address,
      landmark,
      preferredDate,
      preferredTime,
    } = body

    if (!categoryId || !title || !description || !city || !address) {
      return NextResponse.json(
        { error: 'Category, title, description, city and address are required.' },
        { status: 400 }
      )
    }

    // Validate category exists
    const category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } })
    if (!category || !category.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive service category.' }, { status: 400 })
    }

    const requestNumber = generateRequestNumber()

    const createData: Record<string, unknown> = {
      requestNumber,
      customer: { connect: { id: user.id } },
      category: { connect: { id: categoryId } },
      title: title.trim(),
      description: description.trim(),
      urgency: urgency || 'NORMAL',
      city: city.trim(),
      area: (area || '').trim(),
      address: address.trim(),
      status: 'OPEN',
    }

    if (subcategoryId) createData.subcategory = { connect: { id: subcategoryId } }
    if (landmark) createData.landmark = landmark.trim()
    if (cityId) createData.cityId = cityId
    if (preferredDate) createData.preferredDate = new Date(preferredDate)
    if (preferredTime) createData.preferredTime = preferredTime

    const serviceRequest = await serviceRequestRepository.create(
      createData as Parameters<typeof serviceRequestRepository.create>[0]
    )

    return NextResponse.json({
      success: true,
      request: {
        id: serviceRequest.id,
        requestNumber: serviceRequest.requestNumber,
        status: serviceRequest.status,
      },
    })
  } catch (error) {
    console.error('Error creating service request:', error)
    return NextResponse.json({ error: 'Failed to submit service request.' }, { status: 500 })
  }
}
