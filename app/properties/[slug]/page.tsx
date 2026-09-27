import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyDetailsClient from './PropertyDetailsClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const property = await prisma.property.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { images: true },
    })

    if (!property) {
      return {
        title: 'Property Not Found | PakHaven Real Estate',
      }
    }

    const purposeText = property.purpose === 'FOR_SALE' ? 'For Sale' : 'For Rent'
    const title = `${property.title} - ${purposeText} in ${property.area}, ${property.city} | PakHaven`
    const description = `${property.bedrooms} Bed ${property.propertyType} ${purposeText} in ${property.area}, ${property.city}. ${property.description.substring(0, 140)}...`
    const mainImage = property.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80'

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: mainImage }],
      },
    }
  } catch {
    return { title: 'Property Details | PakHaven Real Estate' }
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params

  let property = null
  try {
    property = await prisma.property.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        features: true,
        agent: true,
      },
    })
  } catch (err) {
    console.error(err)
  }

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />
      <PropertyDetailsClient property={property} />
      <Footer />
    </div>
  )
}
