'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard, { PropertyCardProps } from '@/components/PropertyCard'
import { Heart, Trash2, Building2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<PropertyCardProps['property'][]>([])
  const [loading, setLoading] = useState(true)

  const loadFavorites = async () => {
    setLoading(true)
    const saved = localStorage.getItem('pak_haven_favorites')
    if (!saved) {
      setFavoriteProperties([])
      setLoading(false)
      return
    }

    const ids: string[] = JSON.parse(saved)
    if (ids.length === 0) {
      setFavoriteProperties([])
      setLoading(false)
      return
    }

    try {
      const fetched: PropertyCardProps['property'][] = []
      for (const id of ids) {
        const res = await fetch(`/api/properties/${id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.property) {
            fetched.push(data.property)
          }
        }
      }
      setFavoriteProperties(fetched)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  const handleClearAll = () => {
    localStorage.removeItem('pak_haven_favorites')
    setFavoriteProperties([])
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <h1 className="text-2xl font-black text-gray-900">Saved Favorite Properties</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">Your saved listings for quick reference and comparison.</p>
          </div>

          {favoriteProperties.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Saved</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-200"></div>
            ))}
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
            <div className="p-4 bg-red-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-red-400">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Saved Properties</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You haven&apos;t saved any properties yet. Click the heart icon on any property card to save it here for later.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center space-x-2 bg-[#16834B] hover:bg-[#126b3d] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Properties</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
