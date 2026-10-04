import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { userRepository } from './db'
import { Role } from '@prisma/client'

const SECRET_KEY = process.env.AUTH_SECRET || 'dev-secret-key-real-estate-pakistan-2026-secure'
const key = new TextEncoder().encode(SECRET_KEY)
const COOKIE_NAME = 'auth_token'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: Role
  phone?: string | null
  avatar?: string | null
  agentId?: string | null
  providerId?: string | null
  providerVerificationStatus?: string | null
  isBlocked?: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export async function encryptSession(user: SessionUser): Promise<string> {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decryptSession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function createSession(user: SessionUser) {
  const token = await encryptSession(user)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return await decryptSession(token)
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession()
  if (!session?.id) return null
  
  try {
    const user = await userRepository.findSessionUser(session.id)

    if (!user) return null
    return {
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
    }
  } catch {
    return session
  }
}
