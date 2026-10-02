import { PropertyPurpose, PropertyType, AreaUnit, FurnishingStatus, PropertyStatus, Prisma } from '@prisma/client'
import { prisma } from '../client'
import { containsInsensitive } from '../provider'
import { propertyImageRepository } from './property-image.repository'
import { propertyFeatureRepository } from './property-feature.repository'

/** Filters accepted by the public property listing / search. */
export interface PropertyListFilters {
  page: number
  limit: number
  purpose?: PropertyPurpose | null
  propertyType?: PropertyType | null
  city?: string | null
  area?: string | null
  query?: string | null
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  minArea?: number
  maxArea?: number
  isFeatured?: boolean
  isVerified?: boolean
  /**
   * One or more statuses. When omitted (or empty) the listing defaults to
   * PUBLISHED so the public API never leaks drafts. A single value or an array
   * is accepted; both are issued as a provider-safe `{ in: [...] }` filter that
   * behaves identically on MySQL/MariaDB and PostgreSQL/Neon.
   */
  status?: PropertyStatus | PropertyStatus[] | null
  sort?: string
}

function buildListWhere(filters: PropertyListFilters): Prisma.PropertyWhereInput {
  const statuses = (
    Array.isArray(filters.status) ? filters.status : filters.status ? [filters.status] : []
  ).filter(Boolean)

  const where: Prisma.PropertyWhereInput = {
    status: { in: statuses.length > 0 ? statuses : [PropertyStatus.PUBLISHED] },
  }

  if (filters.purpose) where.purpose = filters.purpose
  if (filters.propertyType) where.propertyType = filters.propertyType
  if (filters.isFeatured) where.isFeatured = true
  if (filters.isVerified) where.isVerified = true

  if (filters.city) where.city = containsInsensitive(filters.city)
  if (filters.area) where.area = containsInsensitive(filters.area)

  if (filters.query) {
    where.OR = [
      { title: containsInsensitive(filters.query) },
      { city: containsInsensitive(filters.query) },
      { area: containsInsensitive(filters.query) },
      { society: containsInsensitive(filters.query) },
      { address: containsInsensitive(filters.query) },
    ]
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {}
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice
  }

  if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
    where.bedrooms = { gte: filters.bedrooms }
  }

  if (filters.bathrooms !== undefined && filters.bathrooms > 0) {
    where.bathrooms = { gte: filters.bathrooms }
  }

  if (filters.minArea !== undefined || filters.maxArea !== undefined) {
    where.areaSize = {}
    if (filters.minArea !== undefined) where.areaSize.gte = filters.minArea
    if (filters.maxArea !== undefined) where.areaSize.lte = filters.maxArea
  }

  return where
}

function buildListOrderBy(sort?: string): Prisma.PropertyOrderByWithRelationInput {
  switch (sort) {
    case 'price_asc':
      return { price: 'asc' }
    case 'price_desc':
      return { price: 'desc' }
    case 'oldest':
      return { createdAt: 'asc' }
    default:
      return { createdAt: 'desc' }
  }
}

const listInclude = {
  images: { orderBy: { sortOrder: 'asc' } },
  features: true,
  agent: {
    select: {
      id: true,
      name: true,
      slug: true,
      agency: true,
      phone: true,
      whatsapp: true,
      photo: true,
      isVerified: true,
    },
  },
} satisfies Prisma.PropertyInclude

export interface CreatePropertyInput {
  title: string
  slug: string
  description: string
  purpose?: PropertyPurpose
  propertyType?: PropertyType
  price: number
  city: string
  area: string
  society?: string | null
  address: string
  bedrooms: number
  bathrooms: number
  areaSize: number
  areaUnit?: AreaUnit
  furnishing?: FurnishingStatus
  parking: boolean
  isFeatured: boolean
  isVerified: boolean
  status?: PropertyStatus
  latitude?: number | null
  longitude?: number | null
  userId?: string | null
  agentId?: string | null
  imageUrls: string[]
  featureNames: string[]
}

export const propertyRepository = {
  async list(filters: PropertyListFilters) {
    const where = buildListWhere(filters)
    const skip = (filters.page - 1) * filters.limit

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy: buildListOrderBy(filters.sort),
        skip,
        take: filters.limit,
        include: listInclude,
      }),
      prisma.property.count({ where }),
    ])

    return {
      properties,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    }
  },

  /** Property by numeric id or slug, with lightweight agent (API shape). */
  getByIdOrSlug(idOrSlug: string) {
    return prisma.property.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        features: true,
        agent: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            phone: true,
            whatsapp: true,
            agency: true,
            agencyLogo: true,
            bio: true,
            photo: true,
            isVerified: true,
          },
        },
      },
    })
  },

  /** Property for the public detail page (full agent relation). */
  getBySlugForDetails(slug: string) {
    return prisma.property.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        features: true,
        agent: true,
      },
    })
  },

  /** Minimal property for SEO metadata generation. */
  getBySlugForMeta(slug: string) {
    return prisma.property.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { images: true },
    })
  },

  findUnique(id: string) {
    return prisma.property.findUnique({ where: { id } })
  },

  getBySlug(slug: string) {
    return prisma.property.findUnique({ where: { slug } })
  },

  create(data: CreatePropertyInput) {
    return prisma.property.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        purpose: data.purpose ?? PropertyPurpose.FOR_SALE,
        propertyType: data.propertyType ?? PropertyType.HOUSE,
        price: data.price,
        city: data.city,
        area: data.area,
        society: data.society ?? null,
        address: data.address,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        areaSize: data.areaSize,
        areaUnit: data.areaUnit ?? AreaUnit.MARLA,
        furnishing: data.furnishing ?? FurnishingStatus.UNFURNISHED,
        parking: data.parking,
        isFeatured: data.isFeatured,
        isVerified: data.isVerified,
        status: data.status ?? PropertyStatus.PUBLISHED,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        userId: data.userId ?? null,
        agentId: data.agentId ?? null,
        images: {
          create: data.imageUrls.map((url, index) => ({
            url,
            isMain: index === 0,
            sortOrder: index,
          })),
        },
        features: {
          create: data.featureNames.map((name) => ({ name })),
        },
      },
      include: { images: true, features: true },
    })
  },

  update(id: string, data: Prisma.PropertyUncheckedUpdateInput) {
    return prisma.property.update({ where: { id }, data })
  },

  getWithRelations(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: { images: true, features: true, agent: true },
    })
  },

  replaceImages(propertyId: string, urls: string[]) {
    return propertyImageRepository.replaceForProperty(propertyId, urls)
  },

  replaceFeatures(propertyId: string, names: string[]) {
    return propertyFeatureRepository.replaceForProperty(propertyId, names)
  },

  delete(id: string) {
    return prisma.property.delete({ where: { id } })
  },

  /** Featured (published) properties for the homepage, with recent fallback. */
  async findFeaturedForHome(take = 6) {
    const featured = await prisma.property.findMany({
      where: { status: PropertyStatus.PUBLISHED, isFeatured: true },
      take,
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    })

    if (featured.length > 0) return featured

    return prisma.property.findMany({
      where: { status: PropertyStatus.PUBLISHED },
      take,
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    })
  },

  findPublishedForSitemap() {
    return prisma.property.findMany({
      where: { status: PropertyStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    })
  },

  /** Distinct city/area/society values matching a search term (for autocomplete). */
  findLocationsByQuery(query: string, take = 15) {
    return prisma.property.findMany({
      where: {
        OR: [
          { city: containsInsensitive(query) },
          { area: containsInsensitive(query) },
          { society: containsInsensitive(query) },
        ],
      },
      select: { city: true, area: true, society: true },
      take,
    })
  },
}
