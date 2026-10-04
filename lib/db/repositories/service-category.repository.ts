import { Prisma } from '@prisma/client'
import { prisma } from '../client'

export const serviceCategoryRepository = {
  findAllActive() {
    return prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
  },

  findAllAdmin() {
    return prisma.serviceCategory.findMany({
      include: {
        subcategories: true,
        _count: {
          select: {
            providerServices: true,
            requests: true,
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
  },

  findBySlug(slug: string) {
    return prisma.serviceCategory.findUnique({
      where: { slug },
      include: {
        subcategories: { where: { isActive: true } },
      },
    })
  },

  findById(id: string) {
    return prisma.serviceCategory.findUnique({
      where: { id },
      include: { subcategories: true },
    })
  },

  create(data: Prisma.ServiceCategoryCreateInput) {
    return prisma.serviceCategory.create({ data })
  },

  update(id: string, data: Prisma.ServiceCategoryUpdateInput) {
    return prisma.serviceCategory.update({
      where: { id },
      data,
    })
  },

  upsertDefaultCategories(categories: { name: string; slug: string; description: string; icon: string; sortOrder: number }[]) {
    return Promise.all(
      categories.map((cat) =>
        prisma.serviceCategory.upsert({
          where: { slug: cat.slug },
          update: {
            name: cat.name,
            description: cat.description,
            icon: cat.icon,
            sortOrder: cat.sortOrder,
          },
          create: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            icon: cat.icon,
            sortOrder: cat.sortOrder,
            isSystemDefault: true,
            isActive: true,
          },
        })
      )
    )
  },
}
