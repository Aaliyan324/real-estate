import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    const where: Prisma.AgentWhereInput = {}
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { agency: { contains: query } },
      ]
    }

    const agents = await prisma.agent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    })

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Fetch agents error:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}
