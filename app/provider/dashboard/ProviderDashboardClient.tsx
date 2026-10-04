'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Briefcase,
  Star,
  MapPin,
  Save,
  DollarSign,
  AlertCircle,
  Building,
  User,
  Phone,
  Mail,
  Lock,
} from 'lucide-react'

interface ProviderDashboardProps {
  user: any
  provider: any
  eligibleRequests: any[]
  activeJobs: any[]
  feeLedger: any[]
}

export default function ProviderDashboardClient({
  user,
  provider,
  eligibleRequests,
  activeJobs,
  feeLedger,
}: ProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'jobs' | 'fees' | 'profile'>('overview')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Profile Edit state
  const [companyName, setCompanyName] = useState(provider.companyName || '')
  const [bio, setBio] = useState(provider.bio || '')
  const [yearsExperience, setYearsExperience] = useState(provider.yearsExperience || 0)
  const [serviceRadiusKm, setServiceRadiusKm] = useState(provider.serviceRadiusKm || 15)
  const [availableDays, setAvailableDays] = useState(provider.availableDays || '')
  const [availableHours, setAvailableHours] = useState(provider.availableHours || '')
  const [bankName, setBankName] = useState(provider.bankName || '')
  const [bankAccountTitle, setBankAccountTitle] = useState(provider.bankAccountTitle || '')
  const [bankAccountNumber, setBankAccountNumber] = useState(provider.bankAccountNumber || '')

  const status = provider.verificationStatus
  const isBlocked = provider.isBlocked

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/provider/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          bio,
          yearsExperience,
          serviceRadiusKm,
          availableDays,
          availableHours,
          bankName,
          bankAccountTitle,
          bankAccountNumber,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update profile')

      setSuccessMsg('Profile updated successfully!')
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Banner Status */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#16834B] text-white flex items-center justify-center shadow-md">
                <Wrench className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-xs text-gray-500 font-medium">
                  {provider.companyName || 'Individual Service Provider'} • {user.email} • {user.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {status === 'PENDING' && (
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <Clock className="w-4 h-4" />
                  <span>Account Under Review (PENDING)</span>
                </span>
              )}
              {status === 'APPROVED' && !isBlocked && (
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-[#16834B]" />
                  <span>Verified Provider (APPROVED)</span>
                </span>
              )}
              {status === 'REJECTED' && (
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                  <XCircle className="w-4 h-4" />
                  <span>Application Rejected</span>
                </span>
              )}
              {status === 'SUSPENDED' && (
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Account Suspended</span>
                </span>
              )}
              {isBlocked && (
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white border border-slate-700">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>Account Restricted / Blocked</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Verification Alert Message */}
        {status === 'PENDING' && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-4">
            <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <h3 className="font-bold text-sm text-amber-950">Your provider account is currently under review</h3>
              <p>
                Our verification team is reviewing your profile and qualifications. While your status is <strong>PENDING</strong>, you cannot view full customer request addresses or submit offers. You will receive an automated update once approved.
              </p>
            </div>
          </div>
        )}

        {status === 'REJECTED' && (
          <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-4">
            <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-900 space-y-1">
              <h3 className="font-bold text-sm text-red-950">Application Requires Revision</h3>
              <p>{provider.verificationNotes || 'Your application requires additional information before approval.'}</p>
            </div>
          </div>
        )}

        {isBlocked && (
          <div className="p-5 bg-red-900 text-white rounded-2xl flex items-start space-x-4 shadow-lg">
            <AlertCircle className="w-6 h-6 text-red-300 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h3 className="font-bold text-sm text-white">Account Restricted / Blocked</h3>
              <p>
                Your marketplace access has been restricted due to overdue platform fee balances. Please navigate to the <strong>Platform Fees</strong> tab to settle outstanding balances.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'overview' ? 'border-[#16834B] text-[#16834B]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'requests' ? 'border-[#16834B] text-[#16834B]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Matching Requests</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-[#16834B] font-bold">
              {eligibleRequests.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'jobs' ? 'border-[#16834B] text-[#16834B]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>My Jobs</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-bold">
              {activeJobs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`pb-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'fees' ? 'border-[#16834B] text-[#16834B]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Platform Fees</span>
            {provider.feesOwed > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 font-bold">
                Rs. {provider.feesOwed.toLocaleString()}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'profile' ? 'border-[#16834B] text-[#16834B]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile & Settings
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed Jobs</div>
                <div className="text-2xl font-black text-gray-900">{activeJobs.filter((j) => j.status === 'COMPLETED').length}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Rating</div>
                <div className="text-2xl font-black text-amber-500 flex items-center space-x-1">
                  <span>{provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}</span>
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Earnings</div>
                <div className="text-2xl font-black text-[#16834B]">Rs. {provider.totalEarnings.toLocaleString()}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Fees Owed</div>
                <div className={`text-2xl font-black ${provider.feesOwed > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                  Rs. {provider.feesOwed.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Quick Actions / Categories & Locations summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-[#16834B]" />
                  <span>Configured Service Categories</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.categories.map((c: any) => (
                    <span key={c.categoryId} className="px-3 py-1 bg-emerald-50 text-[#16834B] rounded-lg text-xs font-bold border border-emerald-200">
                      {c.category?.name || c.categoryId}
                    </span>
                  ))}
                  {provider.categories.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No service categories selected yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#16834B]" />
                  <span>Selected Operating Cities</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.locations.map((l: any, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-gray-700 rounded-lg text-xs font-bold border border-gray-200">
                      {l.cityName}
                    </span>
                  ))}
                  {provider.locations.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No operating cities configured.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Matching Requests */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Available Customer Service Requests</h2>

            {!status || status !== 'APPROVED' || isBlocked ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-xs space-y-2">
                <Lock className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="font-bold text-sm text-gray-700">Marketplace Access Restricted</p>
                <p>Only verified, approved, and active providers with zero overdue platform fee blocks can submit proposals.</p>
              </div>
            ) : eligibleRequests.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-xs space-y-2">
                <Briefcase className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="font-bold text-sm text-gray-700">No New Matching Requests</p>
                <p>There are currently no open service requests in your selected categories and cities.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {eligibleRequests.map((req) => (
                  <div key={req.id} className="p-5 border border-gray-200 rounded-xl hover:border-emerald-300 transition space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#16834B] border border-emerald-200">
                          {req.category?.name}
                        </span>
                        <h3 className="font-bold text-base text-gray-900 mt-1">{req.title}</h3>
                        <p className="text-xs text-gray-500 flex items-center space-x-2 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{req.area}, {req.city}</span>
                        </p>
                      </div>
                      <Link
                        href={`/provider/requests/${req.id}`}
                        className="bg-[#16834B] hover:bg-[#126b3d] text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                      >
                        Submit Proposal
                      </Link>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{req.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Jobs */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">My Service Jobs</h2>
            {activeJobs.length === 0 ? (
              <p className="text-xs text-gray-500 italic p-6 text-center">No service jobs recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{job.request?.title || `Job #${job.jobNumber}`}</div>
                      <div className="text-gray-500">Agreed Price: Rs. {job.agreedPrice.toLocaleString()}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Platform Fees */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Platform Fee Ledger</h2>
            {feeLedger.length === 0 ? (
              <p className="text-xs text-gray-500 italic p-6 text-center">No platform fee records yet.</p>
            ) : (
              <div className="space-y-3">
                {feeLedger.map((fee) => (
                  <div key={fee.id} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Platform Fee for Job</div>
                      <div className="text-gray-500">Gross: Rs. {fee.grossAmount.toLocaleString()} | Fee (10%): Rs. {fee.platformFee.toLocaleString()}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-bold ${fee.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {fee.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Profile & Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Edit Provider Profile</h2>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Business / Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Bio / Skills Description</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Available Days</label>
                  <input
                    type="text"
                    value={availableDays}
                    onChange={(e) => setAvailableDays(e.target.value)}
                    placeholder="Mon,Tue,Wed,Thu,Fri,Sat"
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Available Hours</label>
                  <input
                    type="text"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(e.target.value)}
                    placeholder="09:00 - 18:00"
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3">Bank Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Account Title</label>
                    <input
                      type="text"
                      value={bankAccountTitle}
                      onChange={(e) => setBankAccountTitle(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Account Number / IBAN</label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#16834B] hover:bg-[#126b3d] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
