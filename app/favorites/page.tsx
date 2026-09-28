'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard, { PropertyCardProps } from '@/components/PropertyCard'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<PropertyCardProps['property'][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const run = async () => {
      const saved = localStorage.getItem('pak_haven_favorites')
      if (!saved) { setLoading(false); return }
      let ids: string[] = []
      try { ids = JSON.parse(saved) } catch { ids = [] }
      if (ids.length === 0) { setLoading(false); return }
      const fetched: PropertyCardProps['property'][] = []
      try {
        for (const id of ids) {
          const res = await fetch(`/api/properties/${id}`)
          if (res.ok) {
            const data = await res.json()
            if (data.property) fetched.push(data.property)
          }
        }
        if (active) setFavoriteProperties(fetched)
      } catch (err) {
        console.error(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [])

  const handleClearAll = () => {
    localStorage.removeItem('pak_haven_favorites')
    setFavoriteProperties([])
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-50 text-red-500 rounded-xl">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Saved Favorite Properties</h1>
              <p className="text-xs text-gray-500">View and manage properties you saved for easy reference.</p>
            </div>
          </div>

          {favoriteProperties.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition cursor-pointer border border-red-200 self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Favorites</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-200 p-4 space-y-3">
                <div className="bg-gray-200 h-44 rounded-lg w-full"></div>
                <div className="bg-gray-200 h-5 w-3/4 rounded-md"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-gray-900">No Saved Properties Yet</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Click the heart icon on any property card to save it to your favorites list.
            </p>
            <Link
              href="/properties"
              className="inline-block bg-[#16834B] hover:bg-[#126b3d] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-md"
            >
              Explore Properties
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
