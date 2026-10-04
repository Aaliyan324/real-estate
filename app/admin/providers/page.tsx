'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Wrench,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Lock,
  Unlock,
  Building,
  User,
  Phone,
  Mail,
  Award,
  DollarSign,
  MapPin,
} from 'lucide-react'

interface ProviderItem {
  id: string
  userId: string
  cnic?: string
  companyName?: string
  bio?: string
  yearsExperience: number
  rating: number
  reviewCount: number
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'BLOCKED'
  verificationNotes?: string
  isBlocked: boolean
  address?: string
  bankName?: string
  bankAccountTitle?: string
  bankAccountNumber?: string
  totalEarnings: number
  feesOwed: number
  feesPaid: number
  user: {
    name: string
    email: string
    phone?: string
    avatar?: string
  }
  categories: { category: { name: string } }[]
  locations: { cityName: string }[]
  _count?: {
    jobs: number
    offers: number
    reviews: number
  }
}

import AdminNav from '@/components/AdminNav'

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<ProviderItem | null>(null)
  const [actionNotes, setActionNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchProviders = async () => {
    setLoading(true)
    try {
      let url = '/api/admin/providers'
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)
      if (params.toString()) url += `?${params.toString()}`

      const res = await fetch(url)
      const data = await res.json()
      if (res.ok) {
        setProviders(data.providers || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [statusFilter])

  const handleUpdateStatus = async (providerId: string, status: string, notes?: string, isBlocked?: boolean) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/providers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          verificationStatus: status,
          verificationNotes: notes || actionNotes,
          isBlocked,
        }),
      })

      if (res.ok) {
        setSelectedProvider(null)
        setActionNotes('')
        fetchProviders()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Wrench className="w-6 h-6 text-[#16834B]" />
              <span>Service Provider Management</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Verify credentials, approve pending registrations, review platform fee ledgers, and manage account statuses.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProviders()}
                placeholder="Search provider, CNIC, email..."
                className="pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING (Review Needed)</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>
        </div>

        {/* Providers Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">Loading service providers...</div>
          ) : providers.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">No service providers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Provider / Company</th>
                    <th className="p-4">CNIC & Contact</th>
                    <th className="p-4">Categories & Cities</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Fees Owed / Paid</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {providers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 text-sm">{p.user.name}</div>
                        <div className="text-gray-500 text-xs">{p.companyName || 'Individual'}</div>
                      </td>
                      <td className="p-4">
                        <div>{p.user.email}</div>
                        <div className="text-gray-500">{p.user.phone || 'N/A'}</div>
                        <div className="text-gray-400 text-[10px]">CNIC: {p.cnic || 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.categories.map((c, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-emerald-50 text-[#16834B] rounded text-[10px] font-bold">
                              {c.category?.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        {p.verificationStatus === 'PENDING' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-300">
                            PENDING
                          </span>
                        )}
                        {p.verificationStatus === 'APPROVED' && !p.isBlocked && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                            APPROVED
                          </span>
                        )}
                        {p.verificationStatus === 'REJECTED' && (
                          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-[10px] border border-red-300">
                            REJECTED
                          </span>
                        )}
                        {p.verificationStatus === 'SUSPENDED' && (
                          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-[10px] border border-red-300">
                            SUSPENDED
                          </span>
                        )}
                        {p.isBlocked && (
                          <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-bold text-[10px]">
                            RESTRICTED / BLOCKED
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-amber-700 font-bold">Owed: Rs. {p.feesOwed.toLocaleString()}</div>
                        <div className="text-gray-500 text-[10px]">Paid: Rs. {p.feesPaid.toLocaleString()}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedProvider(p)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          Review & Action
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Verification Modal */}
        {selectedProvider && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Review Provider Application</h3>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-400 block font-bold">Full Name</span>
                  <span className="font-bold text-gray-900 text-sm">{selectedProvider.user.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold">Company Name</span>
                  <span className="font-bold text-gray-900">{selectedProvider.companyName || 'Individual'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold">Email & Phone</span>
                  <span className="font-bold text-gray-900">{selectedProvider.user.email} • {selectedProvider.user.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold">CNIC Number</span>
                  <span className="font-bold text-gray-900">{selectedProvider.cnic || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold">Experience & Rating</span>
                  <span className="font-bold text-gray-900">
                    {selectedProvider.yearsExperience} Year(s) • ★ {selectedProvider.rating > 0 ? selectedProvider.rating.toFixed(1) : 'New'} ({selectedProvider.reviewCount} reviews)
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold">Completed Jobs</span>
                  <span className="font-bold text-emerald-700">{selectedProvider._count?.jobs ?? 0} jobs</span>
                </div>
                {selectedProvider.bio && (
                  <div className="col-span-2">
                    <span className="text-gray-400 block font-bold">Bio & Description</span>
                    <p className="text-gray-700 font-normal leading-relaxed mt-0.5">{selectedProvider.bio}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-gray-400 block font-bold">Service Categories</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProvider.categories.map((c, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-[#16834B] rounded text-[10px] font-bold">
                        {c.category?.name}
                      </span>
                    ))}
                    {selectedProvider.categories.length === 0 && <span className="text-gray-400 italic">None selected</span>}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block font-bold">Operating Cities</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProvider.locations.map((l, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-[10px] font-bold">
                        {l.cityName}
                      </span>
                    ))}
                    {selectedProvider.locations.length === 0 && <span className="text-gray-400 italic">None selected</span>}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block font-bold">Bank Info</span>
                  <span className="font-bold text-gray-900">
                    {selectedProvider.bankName || 'N/A'} — {selectedProvider.bankAccountTitle || 'N/A'} ({selectedProvider.bankAccountNumber || 'N/A'})
                  </span>
                </div>
                {selectedProvider.verificationNotes && (
                  <div className="col-span-2 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    <span className="text-amber-800 block font-bold text-[10px]">Previous Admin Notes</span>
                    <span className="text-amber-900 font-medium">{selectedProvider.verificationNotes}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Admin Action Note / Reason</label>
                <textarea
                  rows={2}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Enter notes (e.g. Approved after CNIC verification, or Requires updated CNIC photo...)"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-end pt-2">
                <button
                  disabled={submitting}
                  onClick={() => handleUpdateStatus(selectedProvider.id, 'APPROVED', undefined, false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  Approve Provider
                </button>
                <button
                  disabled={submitting}
                  onClick={() => handleUpdateStatus(selectedProvider.id, 'REJECTED')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  Reject Application
                </button>
                <button
                  disabled={submitting}
                  onClick={() => handleUpdateStatus(selectedProvider.id, 'SUSPENDED')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  Suspend Account
                </button>
                <button
                  disabled={submitting}
                  onClick={() => handleUpdateStatus(selectedProvider.id, selectedProvider.verificationStatus, undefined, !selectedProvider.isBlocked)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  {selectedProvider.isBlocked ? 'Unblock Provider' : 'Block Provider'}
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
