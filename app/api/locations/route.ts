import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()

  if (q.length < 2) {
    return NextResponse.json({ cities: [] })
  }

  try {
    const cities = await prisma.locationCity.findMany({
      where: {
        name: { contains: q },
      },
      include: {
        district: {
          select: {
            name: true,
            province: { select: { name: true } },
          },
        },
      },
      take: 12,
      orderBy: [{ name: 'asc' }],
    })

    const result = cities.map((c) => ({
      id: c.id,
      name: c.name,
      district: c.district ? { name: c.district.name } : null,
      province: c.district?.province ? { name: c.district.province.name } : null,
    }))

    return NextResponse.json({ cities: result })
  } catch (error) {
    console.error('Failed to search cities:', error)
    return NextResponse.json({ cities: [] })
  }
}
