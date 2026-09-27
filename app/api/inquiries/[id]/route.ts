import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true, inquiry: updated })
  } catch (error) {
    console.error('Update inquiry status error:', error)
    return NextResponse.json({ error: 'Failed to update inquiry status' }, { status: 500 })
  }
}
