import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: {
        isActive: true,
      },
      include: {
        subcategories: {
          where: { isActive: true },
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ success: true, categories })
  } catch (error) {
    console.error('Failed to load categories:', error)
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }
}
