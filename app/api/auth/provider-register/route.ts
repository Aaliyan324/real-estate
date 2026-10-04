import { NextResponse } from 'next/server'
import { userRepository, serviceProviderRepository, serviceCategoryRepository } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'
import { Role } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      phone,
      cnic,
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
      locations, // Array of { cityName: string, provinceId?: string, districtId?: string }
    } = body

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'Name, email, password, and phone number are required.' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await userRepository.findByEmail(normalizedEmail)

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email address already exists.' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    // 1. Create User with SERVICE_PROVIDER role
    const user = await userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone.trim(),
      role: Role.SERVICE_PROVIDER,
    })

    // 2. Create ServiceProviderProfile with PENDING verification status
    const profile = await serviceProviderRepository.create({
      user: { connect: { id: user.id } },
      cnic: cnic ? cnic.trim() : null,
      companyName: companyName ? companyName.trim() : null,
      bio: bio ? bio.trim() : null,
      yearsExperience: yearsExperience ? parseInt(String(yearsExperience), 10) : 0,
      verificationStatus: 'PENDING',
      address: address ? address.trim() : null,
      serviceRadiusKm: serviceRadiusKm ? parseFloat(String(serviceRadiusKm)) : 15,
      availableDays: availableDays || 'Mon,Tue,Wed,Thu,Fri,Sat',
      availableHours: availableHours || '09:00 - 18:00',
      bankName: bankName ? bankName.trim() : null,
      bankAccountTitle: bankAccountTitle ? bankAccountTitle.trim() : null,
      bankAccountNumber: bankAccountNumber ? bankAccountNumber.trim() : null,
      emergencyContact: emergencyContact ? emergencyContact.trim() : null,
    })

    // 3. Connect selected service categories
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      await serviceProviderRepository.setCategories(profile.id, categoryIds)
    }

    // 4. Connect selected location coverage
    if (Array.isArray(locations) && locations.length > 0) {
      await serviceProviderRepository.setLocations(
        profile.id,
        locations.map((loc: { cityName: string; provinceId?: string; districtId?: string }) => ({
          cityName: loc.cityName,
          provinceId: loc.provinceId,
          districtId: loc.districtId,
        }))
      )
    }

    // 5. Create user session
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      providerId: profile.id,
      providerVerificationStatus: profile.verificationStatus,
      isBlocked: profile.isBlocked,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      provider: {
        id: profile.id,
        verificationStatus: profile.verificationStatus,
      },
    })
  } catch (error) {
    console.error('Provider registration error:', error)
    return NextResponse.json({ error: 'Failed to complete service provider registration.' }, { status: 500 })
  }
}
