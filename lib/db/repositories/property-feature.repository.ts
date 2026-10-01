import { prisma } from '../client'

export const propertyFeatureRepository = {
  replaceForProperty(propertyId: string, names: string[]) {
    return prisma.$transaction([
      prisma.propertyFeature.deleteMany({ where: { propertyId } }),
      ...(names.length > 0
        ? [
            prisma.propertyFeature.createMany({
              data: names.map((name) => ({ propertyId, name })),
            }),
          ]
        : []),
    ])
  },
}
