'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Wrench,
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react'

const POPULAR_CITIES = [
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Karachi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Bahawalpur',
  'Sargodha',
  'Gujrat',
  'Hyderabad',
  'Abbottabad',
]

const DEFAULT_CATEGORIES = [
  { id: 'cat-electrician', name: 'Electrician', icon: '⚡' },
  { id: 'cat-plumber', name: 'Plumber', icon: '🔧' },
  { id: 'cat-ac-technician', name: 'AC Technician', icon: '❄️' },
  { id: 'cat-painter', name: 'Painter', icon: '🎨' },
  { id: 'cat-carpenter', name: 'Carpenter', icon: '🔨' },
  { id: 'cat-mason', name: 'Mason / Civil Worker', icon: '🧱' },
  { id: 'cat-tile-worker', name: 'Tile & Marble Worker', icon: '📐' },
  { id: 'cat-refrigerator', name: 'Refrigerator Technician', icon: '🧊' },
  { id: 'cat-washing-machine', name: 'Washing Machine Technician', icon: '🧺' },
  { id: 'cat-generator', name: 'Generator Technician', icon: '⚙️' },
  { id: 'cat-solar', name: 'Solar Technician', icon: '☀️' },
  { id: 'cat-pest-control', name: 'Pest Control', icon: '🦟' },
  { id: 'cat-water-tank', name: 'Water Tank Cleaning', icon: '🚰' },
  { id: 'cat-geyser', name: 'Geyser Technician', icon: '🔥' },
  { id: 'cat-handyman', name: 'Handyman', icon: '🛠️' },
  { id: 'cat-cleaning', name: 'Deep Cleaning', icon: '✨' },
  { id: 'cat-moving', name: 'Moving & Loading', icon: '🚚' },
  { id: 'cat-internet', name: 'Internet / Network', icon: '📡' },
  { id: 'cat-cctv', name: 'CCTV Technician', icon: '📹' },
  { id: 'cat-locksmith', name: 'Locksmith', icon: '🔑' },
  { id: 'cat-glass', name: 'Glass & Aluminium', icon: '🪟' },
  { id: 'cat-welder', name: 'Welder / Iron Worker', icon: '👨‍🏭' },
  { id: 'cat-roofer', name: 'Roofer / Seepage Fix', icon: '🏠' },
  { id: 'cat-appliance', name: 'Appliance Repair', icon: '📻' },
  { id: 'cat-other', name: 'Other Services', icon: '⚙️' },
]

export default function ProviderRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cnic: '',
    companyName: '',
    bio: '',
    yearsExperience: '3',
    address: '',
    serviceRadiusKm: '15',
    availableDays: 'Mon,Tue,Wed,Thu,Fri,Sat',
    availableHours: '09:00 - 18:00',
    bankName: '',
    bankAccountTitle: '',
    bankAccountNumber: '',
    emergencyContact: '',
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>(['Lahore'])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    )
  }

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/provider-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryIds: selectedCategories,
          locations: selectedCities.map((cityName) => ({ cityName })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register as service provider')
      }

      router.push('/provider/dashboard')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An error occurred during registration')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#16834B] text-white shadow-lg mb-4">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Become a Verified Service Provider</h1>
          <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
            Join Pakistan&apos;s leading real estate home services marketplace. Offer your professional services to thousands of local homeowners.
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center mb-8 space-x-2 sm:space-x-4">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              step === 1 ? 'bg-[#16834B] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Basic Profile</span>
          </button>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              step === 2 ? 'bg-[#16834B] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>2. Services & Locations</span>
          </button>
          <button
            onClick={() => setStep(3)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              step === 3 ? 'bg-[#16834B] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Verification & Payout</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-900">Personal & Login Information</h2>
                  <p className="text-xs text-gray-500">Provide your personal credentials to create your provider account.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Muhammad Tariq"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tariq.services@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (WhatsApp) *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CNIC / Identity Number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        placeholder="35202-1234567-1"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company / Business Name (Optional)</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Tariq Electricians & AC Services"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Professional Experience & Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Describe your skills, qualifications, past jobs, and equipment..."
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-[#16834B] hover:bg-[#126b3d] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition shadow-md"
                  >
                    <span>Next: Select Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Services & Locations */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-900">Services Provided & Service Coverage</h2>
                  <p className="text-xs text-gray-500">Select all categories you specialize in and cities where you offer on-site work.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Select Service Categories *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                    {DEFAULT_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.name)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.name)}
                          className={`flex items-center space-x-2 p-2.5 rounded-lg border text-left text-xs font-medium transition ${
                            isSelected
                              ? 'bg-emerald-50 border-[#16834B] text-[#16834B] font-bold shadow-xs'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span className="truncate">{cat.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#16834B] ml-auto shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Select Operating Cities *</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    {POPULAR_CITIES.map((city) => {
                      const isSelected = selectedCities.includes(city)
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => toggleCity(city)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-[#16834B] text-white shadow-xs'
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {city}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Years of Experience</label>
                    <div className="relative">
                      <Award className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="number"
                        name="yearsExperience"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Service Radius (km)</label>
                    <input
                      type="number"
                      name="serviceRadiusKm"
                      value={formData.serviceRadiusKm}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Available Hours</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="availableHours"
                        value={formData.availableHours}
                        onChange={handleChange}
                        placeholder="09:00 - 18:00"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-[#16834B] hover:bg-[#126b3d] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition shadow-md"
                  >
                    <span>Next: Payment Info</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verification & Payment */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-900">Payout Details & Final Submission</h2>
                  <p className="text-xs text-gray-500">Provide bank information for platform earnings and emergency contacts.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Shop / Office Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Shop 14, Main Commercial Market, Johar Town, Lahore"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Meezan Bank / HBL / Easypaisa"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Account Title</label>
                    <input
                      type="text"
                      name="bankAccountTitle"
                      value={formData.bankAccountTitle}
                      onChange={handleChange}
                      placeholder="Muhammad Tariq"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Account Number / IBAN</label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      placeholder="PK36 MEZN 0001 0203 0405 0607"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Contact Number</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="+92 321 9876543"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 space-y-1">
                  <div className="font-bold flex items-center space-x-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#16834B]" />
                    <span>Provider Verification Notice</span>
                  </div>
                  <p>
                    All new provider accounts start with status <strong className="text-[#16834B]">PENDING</strong>. Your application will be reviewed by admin/employee staff. Customer requests will be unlocked as soon as your account is approved.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#16834B] hover:bg-[#126b3d] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 transition shadow-lg"
                  >
                    {loading ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Already registered as a provider?{' '}
          <Link href="/login" className="font-bold text-[#16834B] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  )
}
