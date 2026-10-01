import { MetadataRoute } from 'next'
import { propertyRepository, agentRepository } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mortgage-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    const properties = await propertyRepository.findPublishedForSitemap()

    const propertyRoutes: MetadataRoute.Sitemap = properties.map((prop) => ({
      url: `${baseUrl}/properties/${prop.slug}`,
      lastModified: prop.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const agents = await agentRepository.listForSitemap()

    const agentRoutes: MetadataRoute.Sitemap = agents.map((agt) => ({
      url: `${baseUrl}/agents/${agt.slug}`,
      lastModified: agt.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...staticRoutes, ...propertyRoutes, ...agentRoutes]
  } catch {
    return staticRoutes
  }
}
