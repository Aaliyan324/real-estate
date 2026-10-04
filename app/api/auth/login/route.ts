import { NextResponse } from 'next/server'
import { userRepository } from '@/lib/db'
import { comparePassword, createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await userRepository.findSessionUser((await userRepository.findByEmail(email.toLowerCase().trim()))?.id || '')
    const fullUser = user ? await userRepository.findByEmail(email.toLowerCase().trim()) : null

    if (!fullUser || !user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isValid = await comparePassword(password, fullUser.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      agentId: user.agent?.id || null,
      providerId: user.providerProfile?.id || null,
      providerVerificationStatus: user.providerProfile?.verificationStatus || null,
      isBlocked: user.providerProfile?.isBlocked || false,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        providerId: user.providerProfile?.id || null,
        providerVerificationStatus: user.providerProfile?.verificationStatus || null,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
