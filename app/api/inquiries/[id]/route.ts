import { NextResponse } from 'next/server'
import { inquiryRepository } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { InquiryStatus } from '@prisma/client'

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
    const { status } = await request.json()

    const existingInquiry = await inquiryRepository.findById(id)

    if (!existingInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    if (session.role === 'AGENT') {
      if (!session.agentId || existingInquiry.agentId !== session.agentId) {
        return NextResponse.json({ error: 'Forbidden: You do not have permission to modify this inquiry' }, { status: 403 })
      }
    }

    const updated = await inquiryRepository.updateStatus(id, status as InquiryStatus)

    return NextResponse.json({ success: true, inquiry: updated })
  } catch (error) {
    console.error('Update inquiry status error:', error)
    return NextResponse.json({ error: 'Failed to update inquiry status' }, { status: 500 })
  }
}
