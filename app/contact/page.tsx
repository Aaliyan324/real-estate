'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
        }),
      })
      if (res.ok) setSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900">Get in Touch With Us</h1>
          <p className="text-xs text-gray-500">Have questions about property listings or agency registration? Send us a message.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Contact Information</h3>
            <div className="space-y-4 text-xs font-semibold text-gray-700">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#F4C430] shrink-0" />
                <div>
                  <strong className="block text-gray-900">Headquarters Address</strong>
                  <span>Main Boulevard, Phase 6 DHA, Lahore, Pakistan</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#16834B] shrink-0" />
                <div>
                  <strong className="block text-gray-900">Helpline</strong>
                  <span>+92 42 111 222 333</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#16834B] shrink-0" />
                <div>
                  <strong className="block text-gray-900">Support Email</strong>
                  <span>support@pakhaven.pk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
            {success ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#16834B] mx-auto" />
                <h4 className="font-bold text-gray-900 text-xl">Thank You for Reaching Out!</h4>
                <p className="text-xs text-gray-500">Our customer support team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ali Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="ali@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#16834B] hover:bg-[#126b3d] text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
