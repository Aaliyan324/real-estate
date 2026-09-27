'use client'

import React from 'react'
import { Filter, RotateCcw } from 'lucide-react'

interface PropertyFiltersProps {
  filters: {
    purpose: string
    type: string
    city: string
    query: string
    minPrice: string
    maxPrice: string
    bedrooms: string
    bathrooms: string
    minArea: string
    maxArea: string
    featured: boolean
    verified: boolean
  }
  onFilterChange: (key: string, value: unknown) => void
  onReset: () => void
}

const PAKISTAN_CITIES = ['Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Multan', 'Sahiwal', 'Gujranwala', 'Peshawar', 'Quetta']

const PROPERTY_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'House', value: 'HOUSE' },
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'Plot', value: 'PLOT' },
  { label: 'Commercial', value: 'COMMERCIAL' },
  { label: 'Office', value: 'OFFICE' },
  { label: 'Shop', value: 'SHOP' },
  { label: 'Farm House', value: 'FARM_HOUSE' },
]

export default function PropertyFilters({ filters, onFilterChange, onReset }: PropertyFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2 font-bold text-gray-900">
          <Filter className="w-5 h-5 text-[#16834B]" />
          <span>Filter Properties</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-gray-500 hover:text-[#16834B] flex items-center space-x-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Purpose: Buy / Rent */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Purpose</label>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => onFilterChange('purpose', '')}
            className={`py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
              !filters.purpose ? 'bg-white text-[#16834B] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('purpose', 'FOR_SALE')}
            className={`py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
              filters.purpose === 'FOR_SALE' ? 'bg-[#16834B] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('purpose', 'FOR_RENT')}
            className={`py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
              filters.purpose === 'FOR_RENT' ? 'bg-[#16834B] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rent
          </button>
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">City</label>
        <div className="relative">
          <select
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
          >
            <option value="">All Pakistan Cities</option>
            {PAKISTAN_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Property Type</label>
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
        >
          {PROPERTY_TYPES.map((pt) => (
            <option key={pt.value} value={pt.value}>{pt.label}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Price Range (PKR)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Bedrooms</label>
        <div className="flex space-x-1">
          {['', '1', '2', '3', '4', '5'].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onFilterChange('bedrooms', b)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                filters.bedrooms === b
                  ? 'bg-[#16834B] text-white border-[#16834B]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#16834B]'
              }`}
            >
              {b === '' ? 'Any' : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => onFilterChange('featured', e.target.checked)}
            className="w-4 h-4 text-[#16834B] rounded border-gray-300 focus:ring-[#16834B]"
          />
          <span>Featured Listings Only</span>
        </label>
        <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={(e) => onFilterChange('verified', e.target.checked)}
            className="w-4 h-4 text-[#16834B] rounded border-gray-300 focus:ring-[#16834B]"
          />
          <span>Verified Properties Only</span>
        </label>
      </div>
    </div>
  )
}
