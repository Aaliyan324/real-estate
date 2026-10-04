'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  MapPin,
  Clock,
  AlertCircle,
  Zap,
  ChevronRight,
  Loader2,
  Briefcase,
  CheckCircle2,
  Star,
} from 'lucide-react'

interface MarketplaceRequest {
  id: string
  requestNumber: string
  title: string
  description: string
  status: string
  urgency: string
  city: string
  area?: string
  address: string
  createdAt: string
  preferredDate?: string
  preferredTime?: string
  category: { name: string; icon?: string }
  subcategory?: { name: string }
  customer: { name: string; avatar?: string }
  offers: { id: string; proposedPrice: number; status: string; createdAt: string }[]
}

const URGENCY_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  ASAP: { icon: '🚨', color: 'text-red-600 bg-red-50 border-red-200', label: 'ASAP Emergency' },
  TODAY: { icon: '⚡', color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Today' },
  NORMAL: { icon: '📅', color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Flexible' },
}

export default function ProviderMarketplacePage() {
  const [requests, setRequests] = useState<MarketplaceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL')

  // Offer modal state
  const [offerModal, setOfferModal] = useState<MarketplaceRequest | null>(null)
  const [offerForm, setOfferForm] = useState({ proposedPrice: '', estimatedDuration: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [offerError, setOfferError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/services/marketplace')
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Failed to load marketplace')
          return
        }
        setRequests(data.requests || [])
        // Track which ones we've already offered on
        const alreadyOffered = new Set<string>(
          data.requests
            .filter((r: MarketplaceRequest) => r.offers.length > 0)
            .map((r: MarketplaceRequest) => r.id)
        )
        setSubmitted(alreadyOffered)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load marketplace')
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!offerModal) return
    setSubmitting(true)
    setOfferError(null)

    try {
      const res = await fetch('/api/services/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: offerModal.id,
          proposedPrice: parseFloat(offerForm.proposedPrice),
          estimatedDuration: offerForm.estimatedDuration,
          message: offerForm.message,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit offer')

      setSubmitted((prev) => new Set([...prev, offerModal.id]))
      setOfferModal(null)
      setOfferForm({ proposedPrice: '', estimatedDuration: '', message: '' })
    } catch (err: unknown) {
      setOfferError(err instanceof Error ? err.message : 'Failed to submit offer')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = requests.filter((r) => {
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.name.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase())
    const matchUrgency = urgencyFilter === 'ALL' || r.urgency === urgencyFilter
    return matchSearch && matchUrgency
  })

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center max-w-md space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">Marketplace Unavailable</h2>
          <p className="text-sm text-gray-500">{error}</p>
          {error.includes('not approved') && (
            <p className="text-xs text-gray-400">
              Your provider account is under review. You will receive an email once approved.
            </p>
          )}
          <Link href="/provider/dashboard" className="text-sm text-[#16834B] font-bold underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Service Request Marketplace</h1>
            <p className="text-emerald-200 text-sm mt-1">
              Browse customer requests in your service area and submit competitive offers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-white/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, service or city..."
                className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            <div className="flex items-center space-x-2">
              {['ALL', 'ASAP', 'TODAY', 'NORMAL'].map((u) => (
                <button
                  key={u}
                  onClick={() => setUrgencyFilter(u)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    urgencyFilter === u
                      ? 'bg-white text-emerald-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {u === 'ASAP' ? '🚨 ASAP' : u === 'TODAY' ? '⚡ Today' : u === 'NORMAL' ? '📅 Flexible' : 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#16834B]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
              <Briefcase className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No requests found</h3>
            <p className="text-xs text-gray-500">
              {search || urgencyFilter !== 'ALL'
                ? 'Try removing filters'
                : 'No open service requests in your service area at the moment. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-medium">
              {filtered.length} request{filtered.length !== 1 ? 's' : ''} available in your service area
            </p>

            {filtered.map((req) => {
              const urgency = URGENCY_CONFIG[req.urgency] || URGENCY_CONFIG.NORMAL
              const alreadyOffered = submitted.has(req.id) || req.offers.length > 0

              return (
                <div
                  key={req.id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${urgency.color}`}
                        >
                          <span>{urgency.icon}</span>
                          <span>{urgency.label}</span>
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {req.category.name}
                          {req.subcategory ? ` › ${req.subcategory.name}` : ''}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900">{req.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{req.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{req.area ? `${req.area}, ` : ''}{req.city}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        </span>
                        {req.preferredDate && (
                          <span className="flex items-center space-x-1 text-amber-600 font-bold">
                            <Zap className="w-3 h-3" />
                            <span>Preferred: {new Date(req.preferredDate).toLocaleDateString()}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {alreadyOffered ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Offer Sent</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setOfferModal(req)
                            setOfferError(null)
                            setOfferForm({ proposedPrice: '', estimatedDuration: '', message: '' })
                          }}
                          className="inline-flex items-center space-x-1.5 bg-[#16834B] hover:bg-[#126b3d] text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Send Offer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {offerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Submit Your Offer</h2>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{offerModal.title}</p>
            </div>

            <form onSubmit={handleSubmitOffer} className="p-5 space-y-4">
              {offerError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{offerError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Price (PKR) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={offerForm.proposedPrice}
                  onChange={(e) => setOfferForm((p) => ({ ...p, proposedPrice: e.target.value }))}
                  placeholder="e.g. 2500"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {offerForm.proposedPrice && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Platform fee (10%): Rs {Math.round(parseFloat(offerForm.proposedPrice) * 0.1).toLocaleString()} — 
                    Your net: Rs {Math.round(parseFloat(offerForm.proposedPrice) * 0.9).toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Estimated Duration *
                </label>
                <select
                  required
                  value={offerForm.estimatedDuration}
                  onChange={(e) => setOfferForm((p) => ({ ...p, estimatedDuration: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select duration</option>
                  <option value="Under 1 hour">Under 1 hour</option>
                  <option value="1–2 hours">1–2 hours</option>
                  <option value="2–4 hours">2–4 hours</option>
                  <option value="Half day (4–6 hrs)">Half day (4–6 hrs)</option>
                  <option value="Full day">Full day</option>
                  <option value="2–3 days">2–3 days</option>
                  <option value="1 week+">1 week+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Message to Customer (Optional)
                </label>
                <textarea
                  rows={3}
                  value={offerForm.message}
                  onChange={(e) => setOfferForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Introduce yourself, mention your experience, what's included in your price..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOfferModal(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#16834B] hover:bg-[#126b3d] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{submitting ? 'Submitting...' : 'Send Offer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
