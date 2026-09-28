'use client'

import React, { useState } from 'react'
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  ShieldCheck,
  Calendar,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  CheckCircle2,
  Check,
  Expand,
  X,
} from 'lucide-react'
import { formatPKRPrice, formatAreaUnit } from '@/lib/utils'
import Map from '@/components/Map'
import BrochureButton from '@/components/BrochureButton'
import ScheduleVisitModal from '@/components/ScheduleVisitModal'

interface PropertyDetailsClientProps {
  property: {
    id: string
    title: string
    slug: string
    description: string
    purpose: string
    propertyType: string
    price: number
    city: string
    area: string
    address: string
    bedrooms: number
    bathrooms: number
    areaSize: number
    areaUnit: string
    furnishing: string
    parking: boolean
    isFeatured: boolean
    isVerified: boolean
    latitude?: number | null
    longitude?: number | null
    images: { url: string }[]
    features: { id: string; name: string }[]
    agent?: {
      id: string
      name: string
      slug: string
      email: string
      phone: string
      whatsapp?: string | null
      agency: string
      photo?: string | null
      isVerified: boolean
    } | null
  }
}

export default function PropertyDetailsClient({ property }: PropertyDetailsClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [visitModalOpen, setVisitModalOpen] = useState(false)
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
  const [copiedShare, setCopiedShare] = useState(false)

  const handleToggleFavorite = () => {
    const saved = localStorage.getItem('pak_haven_favorites')
    let list: string[] = []
    if (saved) {
      try { list = JSON.parse(saved) } catch { list = [] }
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopiedShare(true)
      setTimeout(() => setCopiedShare(false), 3000)
    }
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInquirySubmitting(true)
    setInquiryError(null)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          agentId: property.agent?.id || null,
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          message: inquiryMessage,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setInquirySuccess(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setInquiryError(err.message)
      } else {
        setInquiryError('Inquiry failed')
      }
    } finally {
      setInquirySubmitting(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
      {/* Header Info Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-md text-white uppercase tracking-wider ${
                property.purpose === 'FOR_SALE' ? 'bg-[#16834B]' : 'bg-blue-600'
              }`}>
                {property.purpose === 'FOR_SALE' ? 'For Sale' : 'For Rent'}
              </span>
              {property.isFeatured && (
                <span className="bg-[#F4C430] text-[#1F2937] text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">
                  ★ Featured
                </span>
              )}
              {property.isVerified && (
                <span className="inline-flex items-center text-xs font-bold text-[#16834B] bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Listing
                </span>
              )}
              <span className="text-xs text-gray-500 font-mono">ID: #{property.id.substring(0, 8)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{property.title}</h1>

            <div className="flex items-center text-sm text-gray-600 font-semibold space-x-1">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{property.address}, {property.area}, {property.city}</span>
            </div>
          </div>

          <div className="flex flex-col md:items-end justify-between space-y-3">
            <div className="text-3xl font-black text-[#16834B]">
              {formatPKRPrice(property.price)}
              {property.purpose === 'FOR_RENT' && <span className="text-sm font-normal text-gray-500"> / month</span>}
            </div>

            <div className="flex items-center space-x-2">
              <BrochureButton property={property} />

              <button
                onClick={handleShare}
                className="p-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 transition cursor-pointer relative"
                title="Share Property Link"
              >
                {copiedShare ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg border transition cursor-pointer ${
                  isFavorited ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                title="Save Favorite"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Gallery & Overview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Gallery & Property Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Gallery */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
            {/* Main Stage Image */}
            <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden bg-gray-900 group">
              <img
                src={images[activeImageIndex]}
                alt={`${property.title} photo ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center space-x-1 transition cursor-pointer"
              >
                <Expand className="w-4 h-4" />
                <span>Fullscreen View</span>
              </button>
            </div>

            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#16834B] ring-2 ring-[#16834B]/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specs Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1 border-r border-gray-100 last:border-0">
              <span className="text-xs font-bold uppercase text-gray-400">Bedrooms</span>
              <div className="flex items-center justify-center space-x-1 text-gray-900 font-black text-lg">
                <Bed className="w-5 h-5 text-[#16834B]" />
                <span>{property.bedrooms || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-1 border-r border-gray-100 last:border-0">
              <span className="text-xs font-bold uppercase text-gray-400">Bathrooms</span>
              <div className="flex items-center justify-center space-x-1 text-gray-900 font-black text-lg">
                <Bath className="w-5 h-5 text-[#16834B]" />
                <span>{property.bathrooms || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-1 border-r border-gray-100 last:border-0">
              <span className="text-xs font-bold uppercase text-gray-400">Area Size</span>
              <div className="flex items-center justify-center space-x-1 text-gray-900 font-black text-lg">
                <Maximize2 className="w-5 h-5 text-[#16834B]" />
                <span>{formatAreaUnit(property.areaSize, property.areaUnit)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-gray-400">Type</span>
              <div className="text-gray-900 font-black text-base mt-0.5">
                {property.propertyType.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Property Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {/* Features & Amenities */}
          {property.features.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Features & Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map((feat) => (
                  <div key={feat.id} className="flex items-center space-x-2 bg-green-50 text-[#16834B] p-2.5 rounded-lg text-xs font-bold border border-green-100">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16834B]" />
                    <span>{feat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Map */}
          <Map
            latitude={property.latitude}
            longitude={property.longitude}
            address={property.address}
            city={property.city}
            area={property.area}
          />
        </div>

        {/* Right Sidebar: Agent Info & Contact Options */}
        <div className="lg:col-span-1 space-y-6">
          {/* Agent Profile Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5 sticky top-24">
            <div className="text-center space-y-3 pb-4 border-b border-gray-100">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#16834B] p-0.5 bg-gray-50 shadow-sm">
                <img
                  src={property.agent?.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
                  alt={property.agent?.name || 'PakHaven Agent'}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-lg flex items-center justify-center space-x-1">
                  <span>{property.agent?.name || 'PakHaven Real Estate'}</span>
                  {property.agent?.isVerified && (
                    <span title="Verified Agent"><ShieldCheck className="w-4 h-4 text-[#16834B]" /></span>
                  )}
                </h4>
                <p className="text-xs text-[#16834B] font-semibold">{property.agent?.agency || 'Verified Partner Agency'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${property.agent?.phone || '+9242111222333'}`}
                  className="flex items-center justify-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded-lg transition"
                >
                  <Phone className="w-4 h-4 text-[#16834B]" />
                  <span>Call Agent</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg transition shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => setVisitModalOpen(true)}
                className="w-full bg-[#16834B] hover:bg-[#126b3d] text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center space-x-2 shadow-md cursor-pointer mt-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule a Property Visit</span>
              </button>
            </div>

            {/* Direct Inquiry Form */}
            <div className="space-y-3">
              <h5 className="font-bold text-gray-900 text-sm">Send Inquiry to Agent</h5>

              {inquirySuccess ? (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-[#16834B]" />
                    <span>Inquiry Sent!</span>
                  </div>
                  <p>The listing agent has received your message and will respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  {inquiryError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{inquiryError}</p>}

                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  />

                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Your Phone / Mobile Number"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  />

                  <textarea
                    rows={3}
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="w-full bg-[#1F2937] hover:bg-black text-white font-bold py-2.5 rounded-lg text-xs transition cursor-pointer"
                  >
                    {inquirySubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full cursor-pointer z-50"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl max-h-[85vh] overflow-hidden flex items-center justify-center">
            <img
              src={images[activeImageIndex]}
              alt={`Fullscreen ${activeImageIndex}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Visit Booking Modal */}
      <ScheduleVisitModal
        propertyId={property.id}
        propertyTitle={property.title}
        isOpen={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
      />
    </main>
  )
}
