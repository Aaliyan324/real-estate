'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdminNav from '@/components/AdminNav'
import {
  Briefcase,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Loader2,
  TrendingUp,
  Shield,
  Star,
  Search,
  Check,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Eye,
  Wrench,
} from 'lucide-react'

interface AdminJob {
  id: string
  jobNumber: string
  status: string
  agreedPrice: number
  createdAt: string
  completedAt?: string
  request: {
    title: string
    description: string
    city: string
    area?: string
    address?: string
    landmark?: string
    preferredDate?: string
    preferredTime?: string
    urgency?: string
    category: { name: string }
    attachments?: { url: string }[]
  }
  customer: { id: string; name: string; email: string; phone?: string; avatar?: string }
  provider: {
    id: string
    companyName?: string
    cnic?: string
    verificationStatus?: string
    isBlocked?: boolean
    user: { id: string; name: string; email: string; phone?: string; avatar?: string }
    reviews?: { rating: number }[]
  }
  fee?: { platformFee: number; status: string; percentageRate?: number } | null
}

interface AdminFee {
  id: string
  jobAmount: number
  platformFee: number
  feePercent: number
  status: string
  dueDate: string
  paidDate?: string
  provider: { id: string; user: { name: string; email: string; phone?: string } }
  customer: { name: string }
  job: { jobNumber: string; agreedPrice: number }
  payments: { id: string; amount: number; createdAt: string }[]
}

interface StatGroup {
  status: string
  _count: { id: number }
  _sum: { agreedPrice?: number; platformFee?: number }
}

const JOB_STATUS_COLORS: Record<string, string> = {
  OPEN: 'text-blue-700 bg-blue-50 border-blue-200',
  PROVIDER_SELECTED: 'text-purple-700 bg-purple-50 border-purple-200',
  ACCEPTED: 'text-blue-700 bg-blue-50 border-blue-200',
  IN_PROGRESS: 'text-amber-700 bg-amber-50 border-amber-200',
  COMPLETED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  CANCELLED: 'text-red-700 bg-red-50 border-red-200',
  DISPUTED: 'text-rose-800 bg-rose-100 border-rose-300',
}

const FEE_STATUS_COLORS: Record<string, string> = {
  DUE: 'text-blue-700 bg-blue-50 border-blue-200',
  OVERDUE: 'text-red-700 bg-red-50 border-red-200',
  PAID: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  WAIVED: 'text-gray-600 bg-gray-50 border-gray-200',
}

export default function AdminMarketplacePage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'fees'>('jobs')
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [fees, setFees] = useState<AdminFee[]>([])
  const [jobStats, setJobStats] = useState<StatGroup[]>([])
  const [feeStats, setFeeStats] = useState<StatGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [enforcing, setEnforcing] = useState(false)
  const [enforceResult, setEnforceResult] = useState<string | null>(null)

  // Filters & Modal
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [jobsRes, feesRes] = await Promise.all([
        fetch('/api/admin/marketplace/jobs'),
        fetch('/api/admin/marketplace/fees'),
      ])
      const [jobsData, feesData] = await Promise.all([jobsRes.json(), feesRes.json()])
      if (jobsRes.ok) {
        setJobs(jobsData.jobs || [])
        setJobStats(jobsData.stats || [])
        setFeeStats(jobsData.feeStats || [])
      }
      if (feesRes.ok) setFees(feesData.fees || [])
    } catch (err) {
      console.error('Failed to load admin marketplace data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleEnforceFees = async () => {
    if (!confirm('Run fee enforcement? This will mark overdue fees and auto-block providers with 2+ overdue fees.')) return
    setEnforcing(true)
    setEnforceResult(null)
    try {
      const res = await fetch('/api/admin/fees/enforce', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setEnforceResult(`Done — Marked ${data.markedOverdue} overdue, blocked ${data.blocked} providers.`)
        await loadData()
      } else {
        setEnforceResult(`Error: ${data.error}`)
      }
    } catch {
      setEnforceResult('Failed to run enforcement.')
    } finally {
      setEnforcing(false)
    }
  }

  const totalRevenue = feeStats
    .filter((s) => s.status === 'PAID')
    .reduce((sum, s) => sum + (s._sum.platformFee || 0), 0)
  const totalOwed = feeStats
    .filter((s) => ['DUE', 'OVERDUE'].includes(s.status))
    .reduce((sum, s) => sum + (s._sum.platformFee || 0), 0)
  const overdueFees = feeStats.find((s) => s.status === 'OVERDUE')?._count.id || 0

  const filteredJobs = jobs.filter((j) => {
    const matchStatus = statusFilter === 'ALL' || j.status === statusFilter
    const q = searchQuery.toLowerCase()
    const matchSearch =
      !q ||
      j.jobNumber.toLowerCase().includes(q) ||
      j.request.title.toLowerCase().includes(q) ||
      j.customer.name.toLowerCase().includes(q) ||
      j.provider.user.name.toLowerCase().includes(q) ||
      j.request.city.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-[#16834B]" />
              <span>Service Jobs & Provider Tracking</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Inspect active service jobs, customer requests, assigned providers, and financial platform fees.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleEnforceFees}
              disabled={enforcing}
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer"
            >
              {enforcing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              <span>Run Fee Enforcement</span>
            </button>
          </div>
        </div>

        {enforceResult && (
          <div className={`p-3 rounded-xl text-xs font-medium border ${enforceResult.startsWith('Error') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
            {enforceResult}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Platform Revenue',
              value: `Rs ${totalRevenue.toLocaleString()}`,
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'text-[#16834B] bg-emerald-50',
            },
            {
              label: 'Fees Owed',
              value: `Rs ${totalOwed.toLocaleString()}`,
              icon: <DollarSign className="w-5 h-5" />,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              label: 'Overdue Fees',
              value: overdueFees,
              icon: <AlertCircle className="w-5 h-5" />,
              color: overdueFees > 0 ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50',
            },
            {
              label: 'Completed Jobs',
              value: jobStats.find((s) => s.status === 'COMPLETED')?._count.id || 0,
              icon: <CheckCircle2 className="w-5 h-5" />,
              color: 'text-blue-600 bg-blue-50',
            },
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

        {/* Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex space-x-2">
            {(['jobs', 'fees'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition capitalize cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#16834B] text-white border-[#16834B]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {tab === 'jobs' ? `Service Jobs (${jobs.length})` : `Platform Fees (${fees.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'jobs' && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter job, customer, provider..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">OPEN</option>
                <option value="PROVIDER_SELECTED">PROVIDER_SELECTED</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="DISPUTED">DISPUTED</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#16834B]" />
          </div>
        ) : activeTab === 'jobs' ? (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                  <tr>
                    <th className="px-4 py-3">Job #</th>
                    <th className="px-4 py-3">Service & Location</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Assigned Provider</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Fee Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                        No service jobs match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => {
                      const ratingAvg = job.provider.reviews?.length
                        ? (job.provider.reviews.reduce((s, r) => s + r.rating, 0) / job.provider.reviews.length).toFixed(1)
                        : null

                      return (
                        <tr key={job.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3 font-mono text-[11px] font-bold text-gray-700">
                            {job.jobNumber}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900 max-w-[180px] truncate">
                              {job.request.title}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {job.request.category.name} • <span className="font-bold text-gray-700">{job.request.city}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900">{job.customer.name}</div>
                            <div className="text-[10px] text-gray-500">{job.customer.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-gray-900">{job.provider.user.name}</span>
                              <span className="text-emerald-600 text-[10px] font-bold" title="Verified Provider">✓</span>
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {job.provider.companyName || 'Individual Provider'}
                              {ratingAvg && (
                                <span className="text-amber-600 font-bold ml-1">★ {ratingAvg}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-black text-gray-900">
                            Rs {job.agreedPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${JOB_STATUS_COLORS[job.status] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {job.fee ? (
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${FEE_STATUS_COLORS[job.fee.status] || ''}`}>
                                {job.fee.status} (Rs {job.fee.platformFee.toLocaleString()})
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedJob(job)}
                              className="inline-flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#16834B]" />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                  <tr>
                    {['Job #', 'Provider', 'Customer', 'Job Amount', 'Platform Fee', 'Status', 'Due Date'].map((h) => (
                      <th key={h} className="px-4 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {fees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                        No platform fee records found.
                      </td>
                    </tr>
                  ) : (
                    fees.map((fee) => (
                      <tr key={fee.id} className={`hover:bg-gray-50 transition ${fee.status === 'OVERDUE' ? 'bg-red-50/40' : ''}`}>
                        <td className="px-4 py-3 font-mono text-[11px] text-gray-600 font-bold">{fee.job.jobNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900">{fee.provider.user.name}</div>
                          <div className="text-[10px] text-gray-400">{fee.provider.user.email}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 font-bold">{fee.customer.name}</td>
                        <td className="px-4 py-3 font-bold text-gray-900">
                          Rs {fee.jobAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#16834B]">
                          Rs {fee.platformFee.toLocaleString()} ({fee.feePercent}%)
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${FEE_STATUS_COLORS[fee.status] || ''}`}>
                            {fee.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(fee.dueDate).toLocaleDateString()}
                          {fee.paidDate && (
                            <div className="text-[10px] text-emerald-600 font-bold">
                              Paid: {new Date(fee.paidDate).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Job Detail Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#16834B] tracking-wider">Service Job Overview</span>
                  <h3 className="text-lg font-black text-gray-900">Job #{selectedJob.jobNumber}</h3>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Status & Category */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-gray-200 text-xs">
                <div className="space-y-0.5">
                  <span className="text-gray-400 font-bold text-[10px] block">Service Category</span>
                  <span className="font-bold text-gray-900">{selectedJob.request.category.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 font-bold text-[10px] block">Job Status</span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${JOB_STATUS_COLORS[selectedJob.status]}`}>
                    {selectedJob.status}
                  </span>
                </div>
              </div>

              {/* Customer & Provider side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Customer Box */}
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                  <div className="flex items-center space-x-1.5 text-blue-900 font-bold border-b border-blue-100 pb-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Customer Details</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">Name</span>
                    <span className="font-bold text-gray-900">{selectedJob.customer.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">Contact</span>
                    <span className="text-gray-700">{selectedJob.customer.email}</span>
                    {selectedJob.customer.phone && (
                      <span className="block font-semibold text-blue-700">{selectedJob.customer.phone}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">Location</span>
                    <span className="text-gray-800 font-medium">
                      {selectedJob.request.address ? `${selectedJob.request.address}, ` : ''}
                      {selectedJob.request.area ? `${selectedJob.request.area}, ` : ''}
                      {selectedJob.request.city}
                    </span>
                  </div>
                </div>

                {/* Provider Box */}
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                  <div className="flex items-center space-x-1.5 text-emerald-900 font-bold border-b border-emerald-100 pb-1.5">
                    <Wrench className="w-4 h-4 text-[#16834B]" />
                    <span>Assigned Provider</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">Provider Name</span>
                    <span className="font-bold text-gray-900 flex items-center space-x-1">
                      <span>{selectedJob.provider.user.name}</span>
                      <span className="text-[#16834B] text-[10px] font-bold">✓ Verified</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">Company / Business</span>
                    <span className="text-gray-700">{selectedJob.provider.companyName || 'Individual Provider'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold text-[10px]">Contact</span>
                    <span className="text-gray-700">{selectedJob.provider.user.email}</span>
                    {selectedJob.provider.user.phone && (
                      <span className="block font-semibold text-[#16834B]">{selectedJob.provider.user.phone}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Request Problem Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2">
                <span className="text-gray-400 block font-bold text-[10px] uppercase">Service Request Details</span>
                <h4 className="font-bold text-gray-900 text-sm">{selectedJob.request.title}</h4>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{selectedJob.request.description}</p>
                {selectedJob.request.preferredDate && (
                  <div className="text-gray-500 pt-1">
                    <span className="font-bold">Scheduled: </span>
                    {new Date(selectedJob.request.preferredDate).toLocaleDateString()} {selectedJob.request.preferredTime || ''}
                  </div>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs">
                <span className="text-emerald-400 block font-bold text-[10px] uppercase">Financial Summary</span>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-slate-800 p-2 rounded-lg">
                    <span className="text-gray-400 block text-[10px]">Agreed Service Price</span>
                    <span className="font-black text-sm text-white">Rs {selectedJob.agreedPrice.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-800 p-2 rounded-lg">
                    <span className="text-gray-400 block text-[10px]">Platform Fee ({selectedJob.fee?.percentageRate || 10}%)</span>
                    <span className="font-black text-sm text-amber-400">
                      Rs {(selectedJob.fee?.platformFee || selectedJob.agreedPrice * 0.1).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2 rounded-lg">
                    <span className="text-gray-400 block text-[10px]">Provider Net Earnings</span>
                    <span className="font-black text-sm text-emerald-400">
                      Rs {(selectedJob.agreedPrice - (selectedJob.fee?.platformFee || selectedJob.agreedPrice * 0.1)).toLocaleString()}
                    </span>
                  </div>
                </div>
                {selectedJob.fee && (
                  <div className="text-right text-[10px] text-gray-400 pt-1">
                    Fee Status: <strong className="text-white uppercase">{selectedJob.fee.status}</strong>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Close Overview
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

