'use client'

import React, { useState } from 'react'
import { FileText } from 'lucide-react'
import { formatPKRPrice, formatAreaUnit } from '@/lib/utils'

interface PropertyBrochureProps {
  property: {
    id: string
    title: string
    purpose: string
    propertyType: string
    price: number
    city: string
    area: string
    address: string
    bedrooms: number
    bathrooms: number
    areaSize: number
    areaUnit: string
    description: string
    furnishing: string
    parking: boolean
    features: { name: string }[]
    images: { url: string }[]
    agent?: {
      name: string
      agency: string
      phone: string
      email: string
    } | null
  }
}

export default function BrochureButton({ property }: PropertyBrochureProps) {
  const [generating, setGenerating] = useState(false)

  const handlePrintBrochure = () => {
    setGenerating(true)

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to generate brochure')
      setGenerating(false)
      return
    }

    const mainImage = property.images && property.images.length > 0 ? property.images[0].url : ''
    const featuresList = property.features.map((f) => `<span style="background: #e8f5ee; color: #16834B; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block; margin: 3px;">✓ ${f.name}</span>`).join('')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${property.title} - Property Brochure</title>
          <style>
            body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; margin: 0; padding: 30px; color: #1F2937; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #16834B; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; color: #16834B; }
            .badge { background: #16834B; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; }
            .title { font-size: 20px; font-weight: 800; margin-bottom: 8px; color: #111827; }
            .location { color: #4B5563; font-size: 13px; margin-bottom: 15px; }
            .price { font-size: 24px; font-weight: 900; color: #16834B; margin-bottom: 20px; }
            .img-box { width: 100%; height: 320px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; background: #F5F7F6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .stat-box { text-align: center; }
            .stat-label { font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: bold; }
            .stat-val { font-size: 14px; font-weight: 800; color: #1F2937; margin-top: 4px; }
            .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #16834B; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; margin-top: 20px; margin-bottom: 10px; }
            .desc { font-size: 12px; line-height: 1.6; color: #374151; }
            .agent-card { background: #1F2937; color: white; padding: 15px; border-radius: 8px; margin-top: 30px; display: flex; justify-content: space-between; align-items: center; }
            .footer-note { font-size: 10px; color: #9CA3AF; text-align: center; margin-top: 30px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">PakHaven Real Estate</div>
            <div class="badge">${property.purpose === 'FOR_SALE' ? 'FOR SALE' : 'FOR RENT'}</div>
          </div>

          <div class="title">${property.title}</div>
          <div class="location">📍 ${property.address}, ${property.area}, ${property.city} | Property ID: ${property.id}</div>
          <div class="price">${formatPKRPrice(property.price)}</div>

          ${mainImage ? `<img src="${mainImage}" class="img-box" />` : ''}

          <div class="grid">
            <div class="stat-box">
              <div class="stat-label">Bedrooms</div>
              <div class="stat-val">${property.bedrooms || 'N/A'}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Bathrooms</div>
              <div class="stat-val">${property.bathrooms || 'N/A'}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Area Size</div>
              <div class="stat-val">${formatAreaUnit(property.areaSize, property.areaUnit)}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Property Type</div>
              <div class="stat-val">${property.propertyType}</div>
            </div>
          </div>

          <div class="section-title">Property Overview</div>
          <div class="desc">${property.description}</div>

          ${property.features.length > 0 ? `
            <div class="section-title">Features & Amenities</div>
            <div>${featuresList}</div>
          ` : ''}

          <div class="agent-card">
            <div>
              <div style="font-size: 14px; font-weight: 800;">Listed By: ${property.agent?.name || 'PakHaven Agent'}</div>
              <div style="font-size: 11px; color: #F4C430; margin-top: 2px;">${property.agent?.agency || 'Official Property Consultant'}</div>
            </div>
            <div style="font-size: 12px; text-align: right;">
              <div>📞 ${property.agent?.phone || '+92 42 111 222 333'}</div>
              <div>✉️ ${property.agent?.email || 'info@pakhaven.pk'}</div>
            </div>
          </div>

          <div class="footer-note">Generated automatically via PakHaven Real Estate Platform (pakhaven.pk)</div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
    setGenerating(false)
  }

  return (
    <button
      onClick={handlePrintBrochure}
      disabled={generating}
      className="inline-flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer border border-gray-300"
      title="Download Printable PDF Brochure"
    >
      <FileText className="w-4 h-4 text-[#16834B]" />
      <span>{generating ? 'Preparing...' : 'PDF Brochure'}</span>
    </button>
  )
}
