import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceJobRepository } from '@/lib/db'
import { prisma } from '@/lib/db/client'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const job = await serviceJobRepository.findById(id)
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Access control: customer, provider user, or admin
    const isCustomer = job.customerId === user.id
    const isAdmin = user.role === 'ADMIN' || user.role === 'EMPLOYEE'
    const isProvider = job.provider.userId === user.id

    if (!isCustomer && !isAdmin && !isProvider) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json({ error: 'Failed to load job' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const job = await serviceJobRepository.findById(id)
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const body = await request.json()
    const { action, note } = body

    const validActions = ['START', 'COMPLETE', 'CANCEL']
    if (!action || !validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be START, COMPLETE, or CANCEL' }, { status: 400 })
    }

    const isProvider = job.provider.userId === user.id
    const isCustomer = job.customerId === user.id
    const isAdmin = user.role === 'ADMIN' || user.role === 'EMPLOYEE'

    // State machine validation
    if (action === 'START') {
      if (!isProvider && !isAdmin) {
        return NextResponse.json({ error: 'Only the provider can start a job.' }, { status: 403 })
      }
      if (job.status !== 'ACCEPTED') {
        return NextResponse.json({ error: 'Job must be in ACCEPTED state to start.' }, { status: 400 })
      }
      await serviceJobRepository.updateStatus(id, 'IN_PROGRESS', note || 'Provider started the job.', user.id)
    } else if (action === 'COMPLETE') {
      if (!isProvider && !isAdmin) {
        return NextResponse.json({ error: 'Only the provider can mark a job as complete.' }, { status: 403 })
      }
      if (job.status !== 'IN_PROGRESS') {
        return NextResponse.json({ error: 'Job must be IN_PROGRESS to complete.' }, { status: 400 })
      }
      await serviceJobRepository.updateStatus(id, 'COMPLETED', note || 'Job completed by provider.', user.id)

      // Update request status to COMPLETED
      await prisma.serviceRequest.update({
        where: { id: job.requestId },
        data: { status: 'COMPLETED' },
      })
    } else if (action === 'CANCEL') {
      if (!isCustomer && !isAdmin) {
        return NextResponse.json({ error: 'Only the customer or admin can cancel a job.' }, { status: 403 })
      }
      if (['COMPLETED', 'CANCELLED'].includes(job.status)) {
        return NextResponse.json({ error: 'Job is already completed or cancelled.' }, { status: 400 })
      }
      await serviceJobRepository.updateStatus(id, 'CANCELLED', note || 'Job cancelled.', user.id)
      await prisma.serviceRequest.update({
        where: { id: job.requestId },
        data: { status: 'CANCELLED' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating job status:', error)
    return NextResponse.json({ error: 'Failed to update job status' }, { status: 500 })
  }
}
