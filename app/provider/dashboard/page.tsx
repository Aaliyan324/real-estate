'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Star,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  MapPin,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

interface ProviderJob {
  id: string
  jobNumber: string
  status: string
  agreedPrice: number
  createdAt: string
  completedAt?: string
  request: { title: string; category: { name: string } }
  customer: { name: string; phone?: string; address?: string }
  fee?: { platformFee: number; status: string }
  review?: { rating: number; comment?: string } | null
}

interface ProviderOffer {
  id: string
  proposedPrice: number
  estimatedDuration: string
  status: string
  createdAt: string
  request: { title: string; category: { name: string }; customer: { name: string } }
}

const JOB_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  ACCEPTED: { label: 'Accepted — Ready to Start', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  COMPLETED: { label: 'Completed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-700 bg-red-50 border-red-200' },
}

export default function ProviderDashboardPage() {
  const [jobs, setJobs] = useState<ProviderJob[]>([])
  const [offers, setOffers] = useState<ProviderOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingJob, setUpdatingJob] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, offersRes] = await Promise.all([
          fetch('/api/services/jobs'),
          fetch('/api/services/offers/mine'),
        ])

        const [jobsData, offersData] = await Promise.all([jobsRes.json(), offersRes.json()])

        if (jobsRes.ok) setJobs(jobsData.jobs || [])
        if (offersRes.ok) setOffers(offersData.offers || [])
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleJobAction = async (jobId: string, action: 'START' | 'COMPLETE') => {
    const confirmMsg =
      action === 'START'
        ? 'Mark this job as In Progress?'
        : 'Mark this job as Complete? The customer will be notified to leave a review.'
    if (!confirm(confirmMsg)) return

    setUpdatingJob(jobId)
    try {
      const res = await fetch(`/api/services/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, status: action === 'START' ? 'IN_PROGRESS' : 'COMPLETED' }
            : j
        )
      )
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update job status')
    } finally {
      setUpdatingJob(null)
    }
  }

  const stats = {
    activeJobs: jobs.filter((j) => ['ACCEPTED', 'IN_PROGRESS'].includes(j.status)).length,
    completedJobs: jobs.filter((j) => j.status === 'COMPLETED').length,
    totalEarned: jobs
      .filter((j) => j.status === 'COMPLETED')
      .reduce((sum, j) => sum + j.agreedPrice, 0),
    pendingOffers: offers.filter((o) => o.status === 'PENDING').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#16834B]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage your jobs, offers, and earnings</p>
          </div>
          <Link
            href="/provider/marketplace"
            className="inline-flex items-center space-x-2 bg-[#16834B] hover:bg-[#126b3d] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm"
          >
            <Star className="w-4 h-4" />
            <span>Browse Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Active Jobs', value: stats.activeJobs, icon: <Briefcase className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50' },
            { label: 'Completed', value: stats.completedJobs, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Pending Offers', value: stats.pendingOffers, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50' },
            { label: 'Total Earned', value: `Rs ${stats.totalEarned.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-[#16834B] bg-emerald-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-2`}>
                {s.icon}
              </div>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Active Jobs */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900">Active Jobs</h2>

          {jobs.filter((j) => ['ACCEPTED', 'IN_PROGRESS'].includes(j.status)).length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No active jobs. Browse the marketplace to find new opportunities.</p>
            </div>
          ) : (
            jobs
              .filter((j) => ['ACCEPTED', 'IN_PROGRESS'].includes(j.status))
              .map((job) => {
                const statusCfg = JOB_STATUS_CONFIG[job.status]
                return (
                  <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900">{job.request.title}</h3>
                        <p className="text-xs text-gray-500">{job.request.category.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">Rs {job.agreedPrice.toLocaleString()}</p>
                        {job.fee && (
                          <p className="text-[10px] text-gray-400">
                            Fee: Rs {job.fee.platformFee.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-[10px] text-gray-500 border-t border-gray-50 pt-2">
                      <span>{job.customer.name}</span>
                      {job.customer.phone && (
                        <a href={`tel:${job.customer.phone}`} className="text-[#16834B] font-bold">
                          {job.customer.phone}
                        </a>
                      )}
                      <span className="font-mono">{job.jobNumber}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {job.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleJobAction(job.id, 'START')}
                          disabled={updatingJob === job.id}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
                        >
                          {updatingJob === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                          <span>Mark as Started</span>
                        </button>
                      )}
                      {job.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleJobAction(job.id, 'COMPLETE')}
                          disabled={updatingJob === job.id}
                          className="flex-1 bg-[#16834B] hover:bg-[#126b3d] disabled:opacity-50 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
                        >
                          {updatingJob === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>Mark as Completed</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
          )}
        </div>

        {/* Recent Completed Jobs */}
        {jobs.filter((j) => j.status === 'COMPLETED').length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Completed Jobs</h2>
            <div className="space-y-2">
              {jobs
                .filter((j) => j.status === 'COMPLETED')
                .slice(0, 5)
                .map((job) => (
                  <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-gray-900">{job.request.title}</p>
                      <p className="text-xs text-gray-500">{job.request.category.name}</p>
                      {job.review && (
                        <div className="flex items-center space-x-1 text-amber-500">
                          {Array.from({ length: job.review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">{job.review.comment}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">Rs {job.agreedPrice.toLocaleString()}</p>
                      {job.fee && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${job.fee.status === 'PAID' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
                          Fee: {job.fee.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Pending Offers */}
        {offers.filter((o) => o.status === 'PENDING').length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-900">My Pending Offers</h2>
            <div className="space-y-2">
              {offers
                .filter((o) => o.status === 'PENDING')
                .map((offer) => (
                  <div key={offer.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{offer.request.title}</p>
                      <p className="text-xs text-gray-500">{offer.request.category.name} — {offer.estimatedDuration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">Rs {offer.proposedPrice.toLocaleString()}</p>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
