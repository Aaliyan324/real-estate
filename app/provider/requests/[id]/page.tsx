'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Briefcase,
  User,
  Calendar,
  Tag,
} from 'lucide-react'

interface ServiceRequest {
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

export default function ProviderRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Offer form state
  const [proposedPrice, setProposedPrice] = useState('')
  const [estimatedDuration, setEstimatedDuration] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [offerError, setOfferError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/services/requests/${id}`)
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Failed to load request')
          return
        }
        setRequest(data.request)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load request')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchRequest()
  }, [id])

  const alreadyOffered = request && request.offers.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!request) return
    setSubmitting(true)
    setOfferError(null)

    try {
      const res = await fetch('/api/services/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          proposedPrice: parseFloat(proposedPrice),
          estimatedDuration: estimatedDuration.trim(),
          message: message.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit offer')

      setSuccess(true)
    } catch (err: unknown) {
      setOfferError(err instanceof Error ? err.message : 'Failed to submit offer')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#16834B]" />
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center max-w-md space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">Request Not Found</h2>
          <p className="text-sm text-gray-500">{error || 'This service request does not exist.'}</p>
          <Link href="/provider/dashboard" className="text-sm text-[#16834B] font-bold underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const urgency = URGENCY_CONFIG[request.urgency] || URGENCY_CONFIG.NORMAL

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100 text-center max-w-md space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 text-[#16834B]" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Proposal Submitted!</h2>
          <p className="text-sm text-gray-500">
            Your offer for <strong>{request.title}</strong> has been submitted. The customer will
            review all proposals and contact the selected provider.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/provider/dashboard"
              className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition text-center"
            >
              Dashboard
            </Link>
            <Link
              href="/provider/marketplace"
              className="flex-1 bg-[#16834B] hover:bg-[#126b3d] text-white font-bold py-2.5 rounded-xl text-sm transition text-center"
            >
              Browse More Requests
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/provider/marketplace"
            className="inline-flex items-center space-x-2 text-emerald-200 hover:text-white text-sm font-medium transition mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <p className="text-emerald-200 text-sm mt-1">
            Request #{request.requestNumber} • Submit your proposal below
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT: Request Details */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${urgency.color}`}
              >
                <span>{urgency.icon}</span>
                <span>{urgency.label}</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border bg-blue-50 text-blue-700 border-blue-200">
                <Tag className="w-3 h-3" />
                <span>{request.category.name}</span>
              </span>
              {request.subcategory && (
                <span className="text-xs text-gray-400 font-medium">
                  › {request.subcategory.name}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900">{request.title}</h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{request.description}</p>
            </div>

            <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#16834B] shrink-0" />
                <span>
                  {request.area ? `${request.area}, ` : ''}
                  {request.city}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-[#16834B] shrink-0" />
                <span>{request.customer.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-[#16834B] shrink-0" />
                <span>Posted {new Date(request.createdAt).toLocaleDateString()}</span>
              </div>
              {request.preferredDate && (
                <div className="flex items-center space-x-2 text-amber-600 font-semibold">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Preferred: {new Date(request.preferredDate).toLocaleDateString()}</span>
                </div>
              )}
              {request.preferredTime && (
                <div className="flex items-center space-x-2">
                  <Zap className="w-3.5 h-3.5 text-[#16834B] shrink-0" />
                  <span>Time: {request.preferredTime}</span>
                </div>
              )}
            </div>

            {/* Address — shown to approved providers */}
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-gray-600 border border-gray-100">
              <span className="font-bold text-gray-700">Address: </span>
              {request.address}
            </div>
          </div>

          {/* Offer count info */}
          {request.offers.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>
                <strong>{request.offers.length}</strong> proposal
                {request.offers.length > 1 ? 's' : ''} already submitted for this request.
              </span>
            </div>
          )}
        </div>

        {/* RIGHT: Proposal Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-6">
            {alreadyOffered ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-[#16834B]" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Offer Already Submitted</h3>
                <p className="text-xs text-gray-500">
                  You have already submitted a proposal for this request. You will be notified if
                  the customer accepts your offer.
                </p>
                <Link
                  href="/provider/marketplace"
                  className="block text-center bg-[#16834B] hover:bg-[#126b3d] text-white font-bold py-2.5 rounded-xl text-sm transition"
                >
                  Browse More Requests
                </Link>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-gray-900 text-sm mb-4">Submit Your Proposal</h3>

                {offerError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{offerError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Your Price (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="1"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                      placeholder="e.g. 2500"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {proposedPrice && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        Platform fee (10%): Rs{' '}
                        {Math.round(parseFloat(proposedPrice) * 0.1).toLocaleString()} — Your net:
                        Rs {Math.round(parseFloat(proposedPrice) * 0.9).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Estimated Duration *
                    </label>
                    <select
                      required
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
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
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Introduce yourself, your experience, what's included in your price..."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#16834B] hover:bg-[#126b3d] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-md"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Proposal</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
