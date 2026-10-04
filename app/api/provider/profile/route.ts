import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { serviceProviderRepository, userRepository } from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const provider = await serviceProviderRepository.findByUserId(user.id)

    if (!provider) {
      return NextResponse.json({ error: 'Service provider profile not found' }, { status: 404 })
    }

    return NextResponse.json({ provider })
  } catch (error) {
    console.error('Error fetching provider profile:', error)
    return NextResponse.json({ error: 'Failed to load provider profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const provider = await serviceProviderRepository.findByUserId(user.id)

    if (!provider) {
      return NextResponse.json({ error: 'Service provider profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      name,
      phone,
      companyName,
      bio,
      yearsExperience,
      address,
      serviceRadiusKm,
      availableDays,
      availableHours,
      bankName,
      bankAccountTitle,
      bankAccountNumber,
      emergencyContact,
      categoryIds,
      locations,
    } = body

    if (name || phone) {
      const { prisma } = await import('@/lib/db')
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(name ? { name: name.trim() } : {}),
          ...(phone ? { phone: phone.trim() } : {}),
        },
      })
    }

    const { prisma } = await import('@/lib/db')
    await prisma.serviceProviderProfile.update({
      where: { id: provider.id },
      data: {
        ...(companyName !== undefined ? { companyName } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(yearsExperience !== undefined ? { yearsExperience: parseInt(String(yearsExperience), 10) } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(serviceRadiusKm !== undefined ? { serviceRadiusKm: parseFloat(String(serviceRadiusKm)) } : {}),
        ...(availableDays !== undefined ? { availableDays } : {}),
        ...(availableHours !== undefined ? { availableHours } : {}),
        ...(bankName !== undefined ? { bankName } : {}),
        ...(bankAccountTitle !== undefined ? { bankAccountTitle } : {}),
        ...(bankAccountNumber !== undefined ? { bankAccountNumber } : {}),
        ...(emergencyContact !== undefined ? { emergencyContact } : {}),
      },
    })

    if (Array.isArray(categoryIds)) {
      await serviceProviderRepository.setCategories(provider.id, categoryIds)
    }

    if (Array.isArray(locations)) {
      await serviceProviderRepository.setLocations(
        provider.id,
        locations.map((loc: { cityName: string; provinceId?: string; districtId?: string }) => ({
          cityName: loc.cityName,
          provinceId: loc.provinceId,
          districtId: loc.districtId,
        }))
      )
    }

    const updatedProvider = await serviceProviderRepository.findByUserId(user.id)

    return NextResponse.json({ success: true, provider: updatedProvider })
  } catch (error) {
    console.error('Error updating provider profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
