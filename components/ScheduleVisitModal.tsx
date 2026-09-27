'use client'

import React, { useState } from 'react'
import { Calendar, X, CheckCircle2 } from 'lucide-react'

interface ScheduleVisitModalProps {
  propertyId: string
  propertyTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function ScheduleVisitModal({ propertyId, propertyTitle, isOpen, onClose }: ScheduleVisitModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    message: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          ...formData,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to schedule property visit')
      }

      setSuccess(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Schedule request failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2 text-[#16834B]">
            <Calendar className="w-6 h-6" />
            <h3 className="font-bold text-lg text-gray-900">Schedule a Property Visit</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            Property: <strong className="text-gray-800">{propertyTitle}</strong>
          </p>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-3">
            <div className="bg-green-100 text-[#16834B] w-14 h-14 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Visit Scheduled Successfully!</h4>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              Our verified agent will contact you shortly via call/WhatsApp to confirm your appointment time.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-[#16834B] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Usman Ali"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="0300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="usman@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Time</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                >
                  <option value="10:00 AM">10:00 AM - Morning</option>
                  <option value="02:00 PM">02:00 PM - Afternoon</option>
                  <option value="05:00 PM">05:00 PM - Evening</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Optional Note for Agent</label>
              <textarea
                rows={2}
                placeholder="Any special requirements or questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#16834B] hover:bg-[#126b3d] text-white font-bold py-3 rounded-xl transition text-sm shadow-md cursor-pointer"
            >
              {submitting ? 'Scheduling Visit...' : 'Confirm Visit Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
