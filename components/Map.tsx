'use client'

import React from 'react'
import { MapPin, Navigation, Compass, Building, CheckCircle2 } from 'lucide-react'

interface MapProps {
  latitude?: number | null
  longitude?: number | null
  address: string
  city: string
  area: string
}

export default function Map({ latitude, longitude, address, city, area }: MapProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs space-y-4 p-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2 font-bold text-gray-900">
          <MapPin className="w-5 h-5 text-[#16834B]" />
          <span>Location & Area Details</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#16834B] border border-emerald-200">
          Verified Location
        </span>
      </div>

      <div className="text-xs text-gray-600 font-medium flex items-start space-x-2">
        <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-gray-900 text-sm">{address}</p>
          <p className="text-gray-500 mt-0.5">{area}, {city}, Pakistan</p>
        </div>
      </div>

      <div className="w-full rounded-xl bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-inner relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
          <Compass className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-base tracking-wide">{area}</span>
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-lg">
            Located in prime {area}, {city}. Accessible via main boulevard with quick access to local commercial centers, schools, healthcare facilities, and public transport.
          </p>

          <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{city} District</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Gated / Prime Area</span>
            </div>
            {latitude && longitude ? (
              <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10 col-span-2 sm:col-span-1">
                <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{latitude.toFixed(2)}°, {longitude.toFixed(2)}°</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
