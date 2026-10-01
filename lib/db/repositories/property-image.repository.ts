import { prisma } from '../client'

export const propertyImageRepository = {
  replaceForProperty(propertyId: string, urls: string[]) {
    return prisma.$transaction([
      prisma.propertyImage.deleteMany({ where: { propertyId } }),
      ...(urls.length > 0
        ? [
            prisma.propertyImage.createMany({
              data: urls.map((url, index) => ({
                propertyId,
                url,
                isMain: index === 0,
                sortOrder: index,
              })),
            }),
          ]
        : []),
    ])
  },
}
