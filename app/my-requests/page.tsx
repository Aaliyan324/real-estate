'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Calendar,
  MapPin,
  Star,
  Plus,
  Briefcase,
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
  createdAt: string
  preferredDate?: string
  category: { name: string; icon?: string }
  subcategory?: { name: string }
  _count: { offers: number }
  job?: { id: string; status: string; agreedPrice?: number } | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  OPEN: {
    label: 'Open — Awaiting Offers',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  OFFER_RECEIVED: {
    label: 'Offer Received',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    icon: <Star className="w-3.5 h-3.5" />,
  },
  ACCEPTED: {
    label: 'Provider Accepted',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-gray-600 bg-gray-100 border-gray-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700 bg-red-50 border-red-200',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  EXPIRED: {
    label: 'Expired',
    color: 'text-gray-500 bg-gray-50 border-gray-200',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
}

const URGENCY_BADGE: Record<string, string> = {
  ASAP: 'text-red-600 bg-red-50 border-red-200',
  TODAY: 'text-amber-600 bg-amber-50 border-amber-200',
  NORMAL: 'text-gray-600 bg-gray-50 border-gray-200',
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('ALL')

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/services/requests')
        const data = await res.json()
        if (!res.ok) {
          if (res.status === 401) setError('Please login to view your service requests.')
          else throw new Error(data.error)
          return
        }
        setRequests(data.requests || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load your requests')
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const TABS = ['ALL', 'OPEN', 'OFFER_RECEIVED', 'ACCEPTED', 'COMPLETED', 'CANCELLED']

  const filtered =
    activeTab === 'ALL' ? requests : requests.filter((r) => r.status === activeTab)

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow border text-center max-w-md space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">Access Denied</h2>
          <p className="text-sm text-gray-500">{error}</p>
          <Link
            href="/login"
            className="inline-block bg-[#16834B] text-white font-bold px-6 py-2.5 rounded-xl text-sm"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Service Requests</h1>
            <p className="text-xs text-gray-500 mt-0.5">Track all your home service requests and provider offers</p>
          </div>
          <Link
            href="/home-services"
            className="inline-flex items-center justify-center space-x-2 bg-[#16834B] hover:bg-[#126b3d] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm touch-target shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar max-w-full">
          {TABS.map((tab) => {
            const count =
              tab === 'ALL'
                ? requests.length
                : requests.filter((r) => r.status === tab).length
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition border shrink-0 touch-target ${
                  activeTab === tab
                    ? 'bg-[#16834B] text-white border-[#16834B]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {tab === 'ALL' ? 'All' : STATUS_CONFIG[tab]?.label || tab}{' '}
                {count > 0 && (
                  <span className={`ml-1 ${activeTab === tab ? 'opacity-80' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-white animate-pulse rounded-2xl border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
              <ClipboardList className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No requests found</h3>
            <p className="text-xs text-gray-500">
              You have not submitted any service requests yet. Find a local expert and get started!
            </p>
            <Link
              href="/home-services"
              className="inline-flex items-center space-x-2 bg-[#16834B] text-white font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Service Request</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => {
              const status = STATUS_CONFIG[req.status] || {
                label: req.status,
                color: 'text-gray-600 bg-gray-50 border-gray-200',
                icon: <Clock className="w-3.5 h-3.5" />,
              }

              return (
                <Link
                  key={req.id}
                  href={`/my-requests/${req.id}`}
                  className="block bg-white border border-gray-100 hover:border-[#16834B]/30 rounded-2xl p-5 transition shadow-xs hover:shadow-sm group"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.color}`}
                        >
                          {status.icon}
                          <span>{status.label}</span>
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            URGENCY_BADGE[req.urgency] || URGENCY_BADGE.NORMAL
                          }`}
                        >
                          {req.urgency === 'ASAP'
                            ? '🚨 ASAP'
                            : req.urgency === 'TODAY'
                            ? '⚡ Today'
                            : 'Flexible'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900 truncate">{req.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{req.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {req.area ? `${req.area}, ` : ''}
                            {req.city}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        </span>
                        {req._count.offers > 0 && (
                          <span className="flex items-center space-x-1 text-amber-600 font-bold">
                            <Star className="w-3 h-3" />
                            <span>
                              {req._count.offers} offer{req._count.offers !== 1 ? 's' : ''} received
                            </span>
                          </span>
                        )}
                        {req.job && (
                          <span className="flex items-center space-x-1 text-emerald-700 font-bold">
                            <Briefcase className="w-3 h-3" />
                            <span>
                              Job — Rs {req.job.agreedPrice?.toLocaleString() || '?'}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="ml-3 flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-gray-400 font-mono">{req.requestNumber}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#16834B] transition" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
