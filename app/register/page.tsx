'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Wrench, ShieldCheck, User } from 'lucide-react'

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
]

const DEFAULT_CATEGORIES = [
  { id: 'cat-electrician', name: 'Electrician', icon: '⚡' },
  { id: 'cat-plumber', name: 'Plumber', icon: '🔧' },
  { id: 'cat-ac-technician', name: 'AC Technician', icon: '❄️' },
  { id: 'cat-painter', name: 'Painter', icon: '🎨' },
  { id: 'cat-carpenter', name: 'Carpenter', icon: '🔨' },
  { id: 'cat-mason', name: 'Mason / Civil Worker', icon: '🧱' },
  { id: 'cat-handyman', name: 'Handyman', icon: '🛠️' },
  { id: 'cat-cleaning', name: 'Deep Cleaning', icon: '✨' },
]

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') === 'provider' ? 'SERVICE_PROVIDER' : 'USER'

  const [role, setRole] = useState<'USER' | 'AGENT' | 'SERVICE_PROVIDER'>(initialType)

  // Standard user/agent state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [agencyName, setAgencyName] = useState('')

  // Provider profile state
  const [cnic, setCnic] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [bio, setBio] = useState('')
  const [yearsExperience, setYearsExperience] = useState('3')
  const [address, setAddress] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccountTitle, setBankAccountTitle] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>(['Lahore'])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      if (role === 'SERVICE_PROVIDER') {
        const res = await fetch('/api/auth/provider-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            phone,
            cnic,
            companyName,
            bio,
            yearsExperience,
            address,
            bankName,
            bankAccountTitle,
            bankAccountNumber,
            categoryIds: selectedCategories,
            locations: selectedCities.map((cityName) => ({ cityName })),
          }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Provider registration failed')

        router.push('/provider/dashboard')
        router.refresh()
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            phone,
            role,
            agencyName: role === 'AGENT' ? agencyName : undefined,
          }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Registration failed')

        router.push(role === 'AGENT' ? '/admin' : '/')
        router.refresh()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-12 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-gray-900">Create PakHaven Account</h1>
            <p className="text-xs text-gray-500">
              Join PakHaven as a Customer, Real Estate Agent, or Service Provider.
            </p>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Account Type</label>
              <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1.5 rounded-xl text-center">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`py-2 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    role === 'USER' ? 'bg-[#16834B] text-white shadow-xs' : 'text-gray-700'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('AGENT')}
                  className={`py-2 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    role === 'AGENT' ? 'bg-[#16834B] text-white shadow-xs' : 'text-gray-700'
                  }`}
                >
                  Agent
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SERVICE_PROVIDER')}
                  className={`py-2 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    role === 'SERVICE_PROVIDER' ? 'bg-[#16834B] text-white shadow-xs' : 'text-gray-700'
                  }`}
                >
                  Provider
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Muhammad Usman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="usman@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone / Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="0300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
              />
            </div>

            {role === 'AGENT' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Agency Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Usman Real Estate & Builders"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                />
              </div>
            )}

            {role === 'SERVICE_PROVIDER' && (
              <div className="space-y-4 pt-2 border-t border-gray-200">
                <h3 className="text-xs font-bold text-[#16834B] uppercase tracking-wider">
                  Service Provider Details
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CNIC Number</label>
                    <input
                      type="text"
                      placeholder="35201-1234567-1"
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company / Business Name</label>
                    <input
                      type="text"
                      placeholder="Usman Electric Services"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Service Categories</label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                    {DEFAULT_CATEGORIES.map((cat) => {
                      const selected = selectedCategories.includes(cat.name)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.name)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                            selected
                              ? 'bg-[#16834B] text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {cat.icon} {cat.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Coverage Cities</label>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                    {POPULAR_CITIES.map((c) => {
                      const selected = selectedCities.includes(c)
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCity(c)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                            selected
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {c}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16834B] hover:bg-[#126b3d] text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer shadow-md"
            >
              {loading
                ? 'Creating Account...'
                : role === 'SERVICE_PROVIDER'
                ? 'Register as Service Provider'
                : role === 'AGENT'
                ? 'Register as Agent'
                : 'Register Account'}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            Already have an account?{' '}
            <Link href="/login" className="text-[#16834B] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading registration page...</div>}>
      <RegisterContent />
    </Suspense>
  )
}

