import { NextResponse } from 'next/server'
import { providerFeeRepository } from '@/lib/db'
import { checkAdminOrEmployeePermission } from '@/lib/adminAuth'

export async function GET(request: Request) {
  try {
    const authCheck = await checkAdminOrEmployeePermission('VIEW_REPORTS')
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any
    const providerId = searchParams.get('providerId') || undefined

    const fees = await providerFeeRepository.findAllAdmin({ status, providerId })

    return NextResponse.json({ success: true, fees })
  } catch (error) {
    console.error('Error fetching admin fees:', error)
    return NextResponse.json({ error: 'Failed to load fees' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = await checkAdminOrEmployeePermission('MANAGE_PROPERTIES')
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }
    const user = authCheck.user!

    const body = await request.json()
    const { feeId, amount, paymentReference, paymentMethod, notes } = body

    if (!feeId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'feeId and amount are required.' }, { status: 400 })
    }

    const payment = await providerFeeRepository.recordPayment({
      feeId,
      providerId: body.providerId,
      amount: parseFloat(amount),
      paymentReference,
      paymentMethod,
      notes,
      verifiedById: user!.id,
    })

    return NextResponse.json({ success: true, payment: { id: payment.id } })
  } catch (error) {
    console.error('Error recording fee payment:', error)
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
  }
}
