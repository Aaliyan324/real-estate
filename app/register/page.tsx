'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Building2, User, Mail, Lock, Phone, Briefcase } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'USER' | 'AGENT'>('USER')
  const [agencyName, setAgencyName] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
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
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      router.push('/')
      router.refresh()
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

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-gray-900">Create PakHaven Account</h1>
            <p className="text-xs text-gray-500">Join as a buyer/renter or real estate agency agent.</p>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Account Type</label>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    role === 'USER' ? 'bg-[#16834B] text-white shadow-xs' : 'text-gray-700'
                  }`}
                >
                  Buyer / Renter
                </button>
                <button
                  type="button"
                  onClick={() => setRole('AGENT')}
                  className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    role === 'AGENT' ? 'bg-[#16834B] text-white shadow-xs' : 'text-gray-700'
                  }`}
                >
                  Real Estate Agent
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone / Mobile Number</label>
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Agency Name</label>
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

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
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
              {loading ? 'Creating Account...' : 'Register Account'}
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
