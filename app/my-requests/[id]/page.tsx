'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Star,
  ThumbsUp,
  Phone,
  DollarSign,
  Wrench,
  Loader2,
} from 'lucide-react'

interface ServiceOffer {
  id: string
  proposedPrice: number
  estimatedDuration: string
  message: string
  status: string
  createdAt: string
  provider: {
    id: string
    businessName?: string
    rating: number
    totalReviews: number
    completedJobs: number
    isVerified: boolean
    user: { name: string; avatar?: string; phone?: string }
    reviews: { rating: number }[]
  }
}

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
  landmark?: string
  preferredDate?: string
  preferredTime?: string
  createdAt: string
  category: { name: string }
  subcategory?: { name: string }
  offers: ServiceOffer[]
  job?: {
    id: string
    status: string
    agreedPrice: number
    startedAt?: string
    completedAt?: string
    provider: {
      id: string
      businessName?: string
      user: { name: string; avatar?: string; phone?: string }
    }
    review?: { rating: number; comment?: string } | null
  } | null
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open — Awaiting Offers', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  OFFER_RECEIVED: { label: 'Offers Received', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  ACCEPTED: { label: 'Provider Accepted', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  COMPLETED: { label: 'Completed', color: 'text-gray-600 bg-gray-100 border-gray-200' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-700 bg-red-50 border-red-200' },
}

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/services/requests/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Not found')
        setRequest(data.request)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load request')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchRequest()
  }, [id])

  const handleAcceptOffer = async (offerId: string) => {
    if (!confirm('Accept this offer? A service job will be created and the provider notified.')) return
    setAccepting(offerId)
    try {
      const res = await fetch(`/api/services/offers/${offerId}/accept`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.refresh()
      window.location.reload()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to accept offer')
    } finally {
      setAccepting(null)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Cancel this service request? This action cannot be undone.')) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/services/requests/${id}/cancel`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/my-requests')
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to cancel')
    } finally {
      setCancelling(false)
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
        <div className="bg-white rounded-2xl p-8 shadow border text-center max-w-md space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-sm text-gray-600">{error || 'Request not found'}</p>
          <Link href="/my-requests" className="text-sm text-[#16834B] font-bold underline">
            Back to My Requests
          </Link>
        </div>
      </div>
    )
  }

  const statusCfg = STATUS_LABELS[request.status] || {
    label: request.status,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
  }
  const canAccept = request.status === 'OPEN' || request.status === 'OFFER_RECEIVED'
  const canCancel = ['OPEN', 'OFFER_RECEIVED'].includes(request.status)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Link
            href="/my-requests"
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">{request.title}</h1>
            <p className="text-xs text-gray-500 font-mono">{request.requestNumber}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Request Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h2 className="text-sm font-bold text-gray-900">Request Details</h2>
              <p className="text-sm text-gray-700">{request.description}</p>

              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 border-t border-gray-50 pt-3">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-3.5 h-3.5 text-gray-400" />
                  <span>{request.category.name}{request.subcategory ? ` — ${request.subcategory.name}` : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{request.area ? `${request.area}, ` : ''}{request.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Urgency: <strong>{request.urgency}</strong></span>
                </div>
                {request.preferredDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{new Date(request.preferredDate).toLocaleDateString()}{request.preferredTime ? ` — ${request.preferredTime}` : ''}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 border-t border-gray-50 pt-3">
                <p><strong>Address:</strong> {request.address}</p>
                {request.landmark && <p className="mt-0.5"><strong>Landmark:</strong> {request.landmark}</p>}
              </div>
            </div>

            {/* Offers */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-900">
                Provider Offers ({request.offers.length})
              </h2>

              {request.offers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-2">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-500 font-medium">No offers yet</p>
                  <p className="text-xs text-gray-400">
                    Verified providers in your area have been notified. You will receive offers shortly.
                  </p>
                </div>
              ) : (
                request.offers.map((offer) => {
                  const avgRating =
                    offer.provider.reviews.length > 0
                      ? (
                          offer.provider.reviews.reduce((sum, r) => sum + r.rating, 0) /
                          offer.provider.reviews.length
                        ).toFixed(1)
                      : null

                  const isAccepted = offer.status === 'ACCEPTED'
                  const isRejected = offer.status === 'REJECTED'

                  return (
                    <div
                      key={offer.id}
                      className={`bg-white border rounded-2xl p-5 space-y-3 ${
                        isAccepted
                          ? 'border-emerald-300 shadow-emerald-50 shadow-md'
                          : 'border-gray-100'
                      }`}
                    >
                      {isAccepted && (
                        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accepted Offer</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#16834B] flex items-center justify-center font-bold text-sm shrink-0">
                            {offer.provider.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {offer.provider.businessName || offer.provider.user.name}
                              {offer.provider.isVerified && (
                                <span className="ml-1.5 text-[10px] bg-[#16834B] text-white px-1.5 py-0.5 rounded-full">
                                  ✓ Verified
                                </span>
                              )}
                            </p>
                            <div className="flex items-center space-x-2 text-[10px] text-gray-500">
                              {avgRating && (
                                <span className="flex items-center space-x-0.5 text-amber-500">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span className="font-bold text-gray-700">{avgRating}</span>
                                  <span className="text-gray-400">({offer.provider.reviews.length})</span>
                                </span>
                              )}
                              <span className="text-gray-400">
                                {offer.provider.completedJobs} jobs done
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-black text-gray-900">
                            Rs {offer.proposedPrice.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-gray-500">{offer.estimatedDuration}</p>
                        </div>
                      </div>

                      {offer.message && (
                        <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          &ldquo;{offer.message}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <p className="text-[10px] text-gray-400">
                          Received {new Date(offer.createdAt).toLocaleDateString()}
                        </p>

                        {canAccept && !isAccepted && !isRejected && (
                          <button
                            onClick={() => handleAcceptOffer(offer.id)}
                            disabled={accepting === offer.id}
                            className="flex items-center space-x-1.5 bg-[#16834B] hover:bg-[#126b3d] disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                          >
                            {accepting === offer.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ThumbsUp className="w-3.5 h-3.5" />
                            )}
                            <span>Accept This Offer</span>
                          </button>
                        )}

                        {isRejected && (
                          <span className="text-xs text-gray-400 font-bold">Not Selected</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Job info */}
            {request.job && (
              <div className="bg-white border border-emerald-200 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Active Job</h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-bold">Rs {request.job.agreedPrice.toLocaleString()}</span>
                  </div>
                  {request.job.provider.user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`tel:${request.job.provider.user.phone}`} className="text-[#16834B] font-bold">
                        {request.job.provider.user.phone}
                      </a>
                    </div>
                  )}
                  <p className="text-gray-600">Provider: {request.job.provider.businessName || request.job.provider.user.name}</p>
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-bold text-[10px]">
                    {request.job.status}
                  </span>
                </div>

                {request.job.status === 'COMPLETED' && !request.job.review && (
                  <Link
                    href={`/my-requests/${request.id}/review`}
                    className="block text-center mt-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    ⭐ Leave a Review
                  </Link>
                )}
              </div>
            )}

            {/* Actions */}
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full border border-red-200 text-red-600 font-bold py-2.5 rounded-xl text-xs hover:bg-red-50 transition"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Request'}
              </button>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2 text-xs text-gray-500">
              <p className="font-bold text-gray-700">Request ID</p>
              <p className="font-mono text-[10px]">{request.requestNumber}</p>
              <p className="font-bold text-gray-700 pt-1">Posted</p>
              <p>{new Date(request.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
