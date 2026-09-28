'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Bed, Bath, Maximize2, MapPin, Heart, ShieldCheck, ArrowRight } from 'lucide-react'
import { formatPKRPrice, formatAreaUnit } from '@/lib/utils'

export interface PropertyCardProps {
  property: {
    id: string
    title: string
    slug: string
    purpose: string
    propertyType: string
    price: number
    city: string
    area: string
    bedrooms: number
    bathrooms: number
    areaSize: number
    areaUnit: string
    isFeatured: boolean
    isVerified: boolean
    images: { url: string }[]
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('pak_haven_favorites')
    if (saved) {
      try {
        const list: string[] = JSON.parse(saved)
        return list.includes(property.id)
      } catch {
        return false
      }
    }
    return false
  })

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const saved = localStorage.getItem('pak_haven_favorites')
    let list: string[] = []
    if (saved) {
      try {
        list = JSON.parse(saved)
      } catch {
        list = []
      }
    }

    if (list.includes(property.id)) {
      list = list.filter((id) => id !== property.id)
      setIsFavorited(false)
    } else {
      list.push(property.id)
      setIsFavorited(true)
    }
    localStorage.setItem('pak_haven_favorites', JSON.stringify(list))
  }

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80'

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#16834B]/40 transition-all duration-300 flex flex-col focus:outline-none focus:ring-2 focus:ring-[#16834B] cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider text-white shadow-xs ${
              property.purpose === 'FOR_SALE' ? 'bg-[#16834B]' : 'bg-blue-600'
            }`}
          >
            {property.purpose === 'FOR_SALE' ? 'For Sale' : 'For Rent'}
          </span>
          {property.isFeatured && (
            <span className="bg-[#F4C430] text-[#1F2937] text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
              ★ Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-md cursor-pointer z-10 ${
            isFavorited ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'
          }`}
          title={isFavorited ? 'Remove from Favorites' : 'Save to Favorites'}
          aria-label={isFavorited ? 'Remove from Favorites' : 'Save to Favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
        </button>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
          {property.propertyType.replace('_', ' ')}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Price & Verified */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-[#16834B] tracking-tight">
              {formatPKRPrice(property.price)}
              {property.purpose === 'FOR_RENT' && <span className="text-xs font-normal text-gray-500"> / mo</span>}
            </span>
            {property.isVerified && (
              <span className="inline-flex items-center text-[11px] font-bold text-[#16834B] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                <ShieldCheck className="w-3 h-3 mr-1 text-[#16834B]" />
                Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 line-clamp-2 text-base group-hover:text-[#16834B] transition leading-snug">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-500 font-medium space-x-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">
              {property.area}, {property.city}
            </span>
          </div>
        </div>

        {/* Specs & View Action Indicator */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-semibold">
          <div className="flex items-center space-x-3">
            {property.bedrooms > 0 && (
              <span className="flex items-center space-x-1" title="Bedrooms">
                <Bed className="w-4 h-4 text-[#16834B]" />
                <span>{property.bedrooms} Beds</span>
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center space-x-1" title="Bathrooms">
                <Bath className="w-4 h-4 text-[#16834B]" />
                <span>{property.bathrooms} Baths</span>
              </span>
            )}
            <span className="flex items-center space-x-1" title="Area">
              <Maximize2 className="w-3.5 h-3.5 text-[#16834B]" />
              <span>{formatAreaUnit(property.areaSize, property.areaUnit)}</span>
            </span>
          </div>

          <span className="text-[#16834B] font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
