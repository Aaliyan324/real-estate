import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'
import { Role } from '@prisma/client'

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, role, agencyName } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const userRole = role === 'AGENT' ? Role.AGENT : Role.USER

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone || null,
        role: userRole,
      },
    })

    let agentId: string | null = null

    if (userRole === Role.AGENT) {
      const slugBase = slugify(name)
      let slug = slugBase
      let counter = 1

      while (await prisma.agent.findUnique({ where: { slug } })) {
        slug = `${slugBase}-${counter}`
        counter++
      }

      const agent = await prisma.agent.create({
        data: {
          userId: user.id,
          name: user.name,
          slug,
          email: user.email,
          phone: phone || '+92 300 0000000',
          whatsapp: phone ? phone.replace(/[^0-9]/g, '') : '923000000000',
          agency: agencyName || `${name} Real Estate`,
          isVerified: false,
        },
      })
      agentId = agent.id
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      agentId,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
