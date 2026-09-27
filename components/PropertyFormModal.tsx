'use client'

import React, { useState } from 'react'
import { X, Building2, Upload } from 'lucide-react'
import ImageUploader from './ImageUploader'

interface PropertyFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: any
}

const PAKISTAN_CITIES = ['Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Faisalabad', 'Multan', 'Sahiwal', 'Gujranwala', 'Peshawar', 'Quetta']

export default function PropertyFormModal({ isOpen, onClose, onSuccess, initialData }: PropertyFormModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    purpose: initialData?.purpose || 'FOR_SALE',
    propertyType: initialData?.propertyType || 'HOUSE',
    price: initialData?.price || '',
    city: initialData?.city || 'Lahore',
    area: initialData?.area || '',
    society: initialData?.society || '',
    address: initialData?.address || '',
    bedrooms: initialData?.bedrooms || '3',
    bathrooms: initialData?.bathrooms || '3',
    areaSize: initialData?.areaSize || '5',
    areaUnit: initialData?.areaUnit || 'MARLA',
    furnishing: initialData?.furnishing || 'UNFURNISHED',
    parking: initialData?.parking ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isVerified: initialData?.isVerified ?? true,
    status: initialData?.status || 'PUBLISHED',
    images: initialData?.images ? initialData.images.map((img: any) => img.url) : [],
    featuresText: initialData?.features ? initialData.features.map((f: any) => f.name).join(', ') : 'Electricity, Gas, Water, Security',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const features = formData.featuresText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    try {
      const url = initialData?.id ? `/api/properties/${initialData.id}` : '/api/properties'
      const method = initialData?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save property')
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Save failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-bold text-xl text-gray-900">
            {initialData ? 'Edit Property Listing' : 'Add New Property Listing'}
          </h3>
          <p className="text-xs text-gray-500">Enter full details for property publication.</p>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Images */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Property Images</label>
            <ImageUploader
              images={formData.images}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
            />
          </div>

          {/* Title & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Property Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 10 Marla Brand New House for Sale in DHA Phase 6"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Price (PKR)</label>
              <input
                type="number"
                required
                placeholder="e.g. 25000000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
              />
            </div>
          </div>

          {/* Purpose & Type */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B]"
              >
                <option value="FOR_SALE">For Sale</option>
                <option value="FOR_RENT">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B]"
              >
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="PLOT">Plot</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="OFFICE">Office</option>
                <option value="SHOP">Shop</option>
                <option value="FARM_HOUSE">Farm House</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B]"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B]"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="SOLD">SOLD</option>
                <option value="RENTED">RENTED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          {/* Area & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Area / Locality</label>
              <input
                type="text"
                required
                placeholder="e.g. DHA Phase 6"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Society Name</label>
              <input
                type="text"
                placeholder="e.g. DHA"
                value={formData.society}
                onChange={(e) => setFormData({ ...formData, society: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                placeholder="e.g. Block MB, House #14"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5"
              />
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Area Size</label>
              <input
                type="number"
                step="0.1"
                value={formData.areaSize}
                onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Area Unit</label>
              <select
                value={formData.areaUnit}
                onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5"
              >
                <option value="MARLA">Marla</option>
                <option value="KANAL">Kanal</option>
                <option value="SQFT">Sq. Ft.</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              required
              placeholder="Full details of property specs, tiles, fittings..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B]"
            />
          </div>

          {/* Feature Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Features (Comma Separated)</label>
            <input
              type="text"
              placeholder="Electricity, Gas, Water Supply, Security, Lawn, Car Parking"
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-[#16834B] rounded border-gray-300 focus:ring-[#16834B]"
              />
              <span>★ Featured Property (Highlight)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-4 h-4 text-[#16834B] rounded border-gray-300 focus:ring-[#16834B]"
              />
              <span>Verified Property Badge</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#16834B] hover:bg-[#126b3d] text-white font-bold py-3 rounded-xl transition text-sm shadow-md cursor-pointer"
          >
            {submitting ? 'Saving Property...' : initialData ? 'Update Property' : 'Publish Property'}
          </button>
        </form>
      </div>
    </div>
  )
}
