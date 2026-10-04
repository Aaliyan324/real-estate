import { prisma } from '../client'

export const locationRepository = {
  getProvinces() {
    return prisma.locationProvince.findMany({
      orderBy: { name: 'asc' },
    })
  },

  getDistricts(provinceId?: string) {
    return prisma.locationDistrict.findMany({
      where: provinceId ? { provinceId } : undefined,
      include: { province: true },
      orderBy: { name: 'asc' },
    })
  },

  getCities(districtId?: string, provinceId?: string) {
    return prisma.locationCity.findMany({
      where: {
        ...(districtId ? { districtId } : {}),
        ...(provinceId ? { provinceId } : {}),
      },
      include: { province: true, district: true },
      orderBy: { name: 'asc' },
    })
  },

  getAreas(cityId?: string) {
    return prisma.locationArea.findMany({
      where: cityId ? { cityId } : undefined,
      orderBy: { name: 'asc' },
    })
  },

  searchCities(query: string) {
    return prisma.locationCity.findMany({
      where: {
        name: { contains: query },
      },
      include: { province: true, district: true },
      take: 20,
      orderBy: { name: 'asc' },
    })
  },
}
