'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import LocationSearch from '@/components/LocationSearch'

export default function HeroSearch() {
  const router = useRouter()
  const [purpose, setPurpose] = useState<'FOR_SALE' | 'FOR_RENT'>('FOR_SALE')
  const [locationText, setLocationText] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedKeyword, setSelectedKeyword] = useState('')
  const [propertyType, setPropertyType] = useState('')

  const handleSelectLocation = (loc: { city: string; areaOrKeyword: string; displayName: string }) => {
    setSelectedCity(loc.city)
    setSelectedKeyword(loc.areaOrKeyword)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const queryParams = new URLSearchParams()
    queryParams.set('purpose', purpose)
    if (selectedCity) queryParams.set('city', selectedCity)
    if (propertyType) queryParams.set('type', propertyType)

    // Determine query keyword
    const q = selectedKeyword || (locationText && !selectedCity ? locationText : '')
    if (q) queryParams.set('query', q)

    router.push(`/properties?${queryParams.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-gray-900 text-left max-w-4xl mx-auto space-y-4 w-full">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Purpose Radio Pills */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 border-b border-gray-100 pb-3">
          <button
            type="button"
            onClick={() => setPurpose('FOR_SALE')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 font-bold text-xs px-4 sm:px-5 py-2.5 rounded-xl border transition cursor-pointer touch-target ${
              purpose === 'FOR_SALE'
                ? 'text-[#16834B] bg-green-50 border-green-200 shadow-xs'
                : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${purpose === 'FOR_SALE' ? 'bg-[#16834B]' : 'bg-gray-400'}`}></span>
            <span>Buy Property</span>
          </button>
          <button
            type="button"
            onClick={() => setPurpose('FOR_RENT')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 font-bold text-xs px-4 sm:px-5 py-2.5 rounded-xl border transition cursor-pointer touch-target ${
              purpose === 'FOR_RENT'
                ? 'text-[#16834B] bg-green-50 border-green-200 shadow-xs'
                : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${purpose === 'FOR_RENT' ? 'bg-[#16834B]' : 'bg-gray-400'}`}></span>
            <span>Rent Property</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-end">
          {/* OLX-Style Location Autocomplete Search */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
              Location / City / Area
            </label>
            <LocationSearch
              value={locationText}
              onChangeText={(text) => {
                setLocationText(text)
                if (selectedCity && !text.includes(selectedCity)) {
                  setSelectedCity('')
                  setSelectedKeyword('')
                }
              }}
              onSelectLocation={handleSelectLocation}
              placeholder="City, area, society (e.g. DHA, Johar Town)..."
            />
          </div>

          {/* Property Type Dropdown */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none touch-target"
            >
              <option value="">All Types</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment / Flat</option>
              <option value="PLOT">Plot & Land</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="OFFICE">Office</option>
              <option value="SHOP">Shop</option>
              <option value="FARM_HOUSE">Farm House</option>
            </select>
          </div>

          {/* Submit button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#16834B] hover:bg-[#126b3d] text-white font-bold text-xs py-3 rounded-lg transition shadow-md flex items-center justify-center space-x-2 cursor-pointer touch-target"
            >
              <Search className="w-4 h-4" />
              <span>Search Properties</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

