'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Building2, Lock, Mail, ArrowRight } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in')
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Login failed')
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
            <div className="bg-green-100 text-[#16834B] w-12 h-12 rounded-2xl mx-auto flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Sign In to PakHaven</h1>
            <p className="text-xs text-gray-500">Enter your credentials to manage listings and favorites.</p>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@pakhaven.pk or agent email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16834B] hover:bg-[#126b3d] text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer shadow-md flex items-center justify-center space-x-1"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#16834B] font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading login page...</div>}>
      <LoginContent />
    </Suspense>
  )
}
