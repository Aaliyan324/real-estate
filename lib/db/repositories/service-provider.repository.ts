import { Prisma, ProviderVerificationStatus } from '@prisma/client'
import { prisma } from '../client'

export interface ProviderListFilters {
  status?: ProviderVerificationStatus
  search?: string
  categoryId?: string
  city?: string
  isBlocked?: boolean
}

export const serviceProviderRepository = {
  findByUserId(userId: string) {
    return prisma.serviceProviderProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        categories: { include: { category: true } },
        locations: true,
        fees: { orderBy: { createdAt: 'desc' }, take: 10 },
        reviews: { include: { customer: { select: { name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } },
      },
    })
  },

  findById(id: string) {
    return prisma.serviceProviderProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        categories: { include: { category: true } },
        locations: true,
        fees: { orderBy: { createdAt: 'desc' } },
        reviews: { include: { customer: { select: { name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } },
      },
    })
  },

  findPublicProfile(id: string) {
    return prisma.serviceProviderProfile.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        bio: true,
        yearsExperience: true,
        rating: true,
        reviewCount: true,
        verificationStatus: true,
        availableDays: true,
        availableHours: true,
        serviceRadiusKm: true,
        createdAt: true,
        user: { select: { name: true, avatar: true } },
        categories: { select: { category: { select: { id: true, name: true, slug: true, icon: true } } } },
        locations: { select: { cityName: true } },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            customer: { select: { name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })
  },

  findAll(filters?: ProviderListFilters) {
    const where: Prisma.ServiceProviderProfileWhereInput = {}

    if (filters?.status) {
      where.verificationStatus = filters.status
    }

    if (filters?.isBlocked !== undefined) {
      where.isBlocked = filters.isBlocked
    }

    if (filters?.search) {
      where.OR = [
        { user: { name: { contains: filters.search } } },
        { user: { email: { contains: filters.search } } },
        { companyName: { contains: filters.search } },
        { cnic: { contains: filters.search } },
      ]
    }

    if (filters?.categoryId) {
      where.categories = {
        some: { categoryId: filters.categoryId },
      }
    }

    if (filters?.city) {
      where.locations = {
        some: { cityName: { contains: filters.city } },
      }
    }

    return prisma.serviceProviderProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        categories: { include: { category: true } },
        locations: true,
        _count: {
          select: {
            jobs: true,
            offers: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  create(data: Prisma.ServiceProviderProfileCreateInput) {
    return prisma.serviceProviderProfile.create({ data })
  },

  updateStatus(id: string, verificationStatus: ProviderVerificationStatus, verificationNotes?: string) {
    return prisma.serviceProviderProfile.update({
      where: { id },
      data: {
        verificationStatus,
        verificationNotes,
      },
    })
  },

  updateBlockStatus(id: string, isBlocked: boolean) {
    return prisma.serviceProviderProfile.update({
      where: { id },
      data: { isBlocked },
    })
  },

  setCategories(providerId: string, categoryIds: string[]) {
    return prisma.$transaction([
      prisma.serviceProviderCategory.deleteMany({ where: { providerId } }),
      prisma.serviceProviderCategory.createMany({
        data: categoryIds.map((categoryId) => ({ providerId, categoryId })),
      }),
    ])
  },

  setLocations(providerId: string, locations: { cityName: string; provinceId?: string; districtId?: string; cityId?: string; areaId?: string }[]) {
    return prisma.$transaction([
      prisma.serviceProviderLocation.deleteMany({ where: { providerId } }),
      prisma.serviceProviderLocation.createMany({
        data: locations.map((loc) => ({
          providerId,
          cityName: loc.cityName,
          provinceId: loc.provinceId,
          districtId: loc.districtId,
          cityId: loc.cityId,
          areaId: loc.areaId,
        })),
      }),
    ])
  },
}
