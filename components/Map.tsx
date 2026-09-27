'use client'

import React from 'react'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'

interface MapProps {
  latitude?: number | null
  longitude?: number | null
  address: string
  city: string
  area: string
}

export default function Map({ latitude, longitude, address, city, area }: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const defaultLat = latitude || 31.5204 // Default Lahore
  const defaultLng = longitude || 74.3587

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${area}, ${city}, Pakistan`)}`

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs space-y-4 p-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2 font-bold text-gray-900">
          <MapPin className="w-5 h-5 text-[#16834B]" />
          <span>Location & Neighborhood</span>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#16834B] hover:underline flex items-center space-x-1"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="text-xs text-gray-600 font-medium flex items-center space-x-1">
        <Navigation className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span>{address}, {area}, {city}, Pakistan</span>
      </div>

      {apiKey ? (
        <div className="w-full h-72 rounded-lg overflow-hidden border border-gray-200">
          <iframe
            title={`Map for ${address}`}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(`${address}, ${city}`)}&center=${defaultLat},${defaultLng}&zoom=14`}
          ></iframe>
        </div>
      ) : (
        <div className="w-full h-64 rounded-lg bg-linear-to-br from-green-50 to-emerald-100 border border-green-200 p-6 flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden">
          <div className="bg-white p-3 rounded-full shadow-md text-[#16834B]">
            <MapPin className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{area}, {city}</h4>
            <p className="text-xs text-gray-600 max-w-sm mt-1">
              Located in prime {area} with easy access to main boulevard, commercial zone, schools and parks.
            </p>
          </div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#16834B] hover:bg-[#126b3d] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
          >
            Explore Area Map
          </a>
        </div>
      )}
    </div>
  )
}
