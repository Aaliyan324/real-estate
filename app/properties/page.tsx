'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PropertyCard, { PropertyCardProps } from '@/components/PropertyCard'
import PropertyFilters from '@/components/PropertyFilters'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Building2 } from 'lucide-react'

function PropertiesContent() {
  const searchParams = useSearchParams()

  const [properties, setProperties] = useState<PropertyCardProps['property'][]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const [filters, setFilters] = useState({
    purpose: searchParams.get('purpose') || '',
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    query: searchParams.get('query') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    featured: searchParams.get('featured') === 'true',
    verified: searchParams.get('verified') === 'true',
  })

  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10))

  useEffect(() => {
    let isSubscribed = true
    setLoading(true)

    const queryParams = new URLSearchParams()
    if (filters.purpose) queryParams.set('purpose', filters.purpose)
    if (filters.type) queryParams.set('type', filters.type)
    if (filters.city) queryParams.set('city', filters.city)
    if (filters.query) queryParams.set('query', filters.query)
    if (filters.minPrice) queryParams.set('minPrice', filters.minPrice)
    if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice)
    if (filters.bedrooms) queryParams.set('bedrooms', filters.bedrooms)
    if (filters.bathrooms) queryParams.set('bathrooms', filters.bathrooms)
    if (filters.featured) queryParams.set('featured', 'true')
    if (filters.verified) queryParams.set('verified', 'true')
    queryParams.set('sort', sort)
    queryParams.set('page', page.toString())
    queryParams.set('limit', '12')

    fetch(`/api/properties?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isSubscribed) {
          setProperties(data.properties || [])
          setTotal(data.pagination?.total || 0)
          setTotalPages(data.pagination?.totalPages || 1)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error(err)
        if (isSubscribed) setLoading(false)
      })

    return () => {
      isSubscribed = false
    }
  }, [filters, sort, page])

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleReset = () => {
    setFilters({
      purpose: '',
      type: '',
      city: '',
      query: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      featured: false,
      verified: false,
    })
    setSort('newest')
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      {/* Top Banner Search */}
      <div className="bg-[#16834B] py-8 px-4 sm:px-6 lg:px-8 text-white shadow-inner">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-2xl sm:text-3xl font-black">Search Properties in Pakistan</h1>
          <p className="text-green-100 text-sm">Discover top residential houses, commercial plots, and apartments across major cities.</p>

          <div className="bg-white p-2 rounded-xl shadow-lg flex flex-col sm:flex-row gap-2 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by area, society, city or title (e.g. Bahria Town, DHA, F-11)..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16834B]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {filters.purpose === 'FOR_SALE'
                ? 'Properties for Sale'
                : filters.purpose === 'FOR_RENT'
                ? 'Properties for Rent'
                : 'All Available Properties'}
            </h2>
            <p className="text-xs text-gray-500">Showing {total} properties matching your criteria</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#16834B]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-600">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value)
                  setPage(1)
                }}
                className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2 font-semibold focus:ring-2 focus:ring-[#16834B] focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <PropertyFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-black/50 p-4 flex justify-center items-center lg:hidden">
              <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-500 font-bold text-sm"
                  >
                    Close ✕
                  </button>
                </div>
                <PropertyFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                />
              </div>
            </div>
          )}

          {/* Properties Grid */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-200 p-4 space-y-3">
                    <div className="bg-gray-200 h-44 rounded-lg w-full"></div>
                    <div className="bg-gray-200 h-5 w-3/4 rounded-md"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-gray-400">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No properties found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  We couldn&apos;t find any properties matching your current filter criteria. Try changing the location, price range, or clearing filters.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-[#16834B] hover:bg-[#126b3d] text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 pt-6">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-gray-700 px-4">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading properties...</div>}>
      <PropertiesContent />
    </Suspense>
  )
}
