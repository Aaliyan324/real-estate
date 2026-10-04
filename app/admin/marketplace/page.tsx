'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
} from 'lucide-react'

interface AdminJob {
  id: string
  jobNumber: string
  status: string
  agreedPrice: number
  createdAt: string
  completedAt?: string
  request: { title: string; category: { name: string } }
  customer: { id: string; name: string; email: string }
  provider: { id: string; user: { id: string; name: string } }
  fee?: { platformFee: number; status: string } | null
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
  ACCEPTED: 'text-blue-700 bg-blue-50 border-blue-200',
  IN_PROGRESS: 'text-amber-700 bg-amber-50 border-amber-200',
  COMPLETED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  CANCELLED: 'text-red-700 bg-red-50 border-red-200',
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketplace Management</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage service jobs, platform fees, and provider compliance</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleEnforceFees}
              disabled={enforcing}
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
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

        {/* Tabs */}
        <div className="flex space-x-2">
          {(['jobs', 'fees'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition capitalize ${
                activeTab === tab
                  ? 'bg-[#16834B] text-white border-[#16834B]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab === 'jobs' ? `Service Jobs (${jobs.length})` : `Platform Fees (${fees.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#16834B]" />
          </div>
        ) : activeTab === 'jobs' ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Job #', 'Service', 'Customer', 'Provider', 'Price', 'Status', 'Fee Status', 'Date'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-bold text-gray-600 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                        No jobs found
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{job.jobNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900 max-w-[150px] truncate">{job.request.title}</div>
                          <div className="text-[10px] text-gray-400">{job.request.category.name}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{job.customer.name}</td>
                        <td className="px-4 py-3 text-gray-700">{job.provider.user.name}</td>
                        <td className="px-4 py-3 font-bold text-gray-900">
                          Rs {job.agreedPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border ${JOB_STATUS_COLORS[job.status] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {job.fee ? (
                            <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border text-[10px] ${FEE_STATUS_COLORS[job.fee.status] || ''}`}>
                              {job.fee.status} (Rs {job.fee.platformFee.toLocaleString()})
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Job #', 'Provider', 'Customer', 'Job Amount', 'Platform Fee', 'Status', 'Due Date'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-bold text-gray-600 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {fees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        No fees found
                      </td>
                    </tr>
                  ) : (
                    fees.map((fee) => (
                      <tr key={fee.id} className={`hover:bg-gray-50 transition ${fee.status === 'OVERDUE' ? 'bg-red-50/30' : ''}`}>
                        <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{fee.job.jobNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900">{fee.provider.user.name}</div>
                          <div className="text-[10px] text-gray-400">{fee.provider.user.email}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{fee.customer.name}</td>
                        <td className="px-4 py-3 font-bold text-gray-900">
                          Rs {fee.jobAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#16834B]">
                          Rs {fee.platformFee.toLocaleString()} ({fee.feePercent}%)
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border ${FEE_STATUS_COLORS[fee.status] || ''}`}>
                            {fee.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(fee.dueDate).toLocaleDateString()}
                          {fee.paidDate && (
                            <div className="text-[10px] text-emerald-600">
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
      </div>
    </div>
  )
}
