'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyFormModal from '@/components/PropertyFormModal'
import {
  Building2,
  Users,
  MessageSquare,
  Calendar,
  Plus,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ShieldCheck,
  Star,
  Eye,
} from 'lucide-react'
import { formatPKRPrice } from '@/lib/utils'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'properties' | 'inquiries' | 'visits' | 'agents'>('properties')

  const [properties, setProperties] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [visits, setVisits] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [propertyModalOpen, setPropertyModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [propRes, inqRes, visRes, agtRes] = await Promise.all([
        fetch('/api/properties?limit=100&status=DRAFT,PUBLISHED,SOLD,RENTED,ARCHIVED'),
        fetch('/api/inquiries'),
        fetch('/api/visits'),
        fetch('/api/agents'),
      ])

      const propData = await propRes.json()
      const inqData = await inqRes.json()
      const visData = await visRes.json()
      const agtData = await agtRes.json()

      if (propRes.ok) setProperties(propData.properties || [])
      if (inqRes.ok) setInquiries(inqData.inquiries || [])
      if (visRes.ok) setVisits(visData.visits || [])
      if (agtRes.ok) setAgents(agtData.agents || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateVisitStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Admin Control Panel</h1>
            <p className="text-xs text-gray-500">Manage real estate listings, customer inquiries, visit bookings, and agent profiles.</p>
          </div>

          <button
            onClick={() => {
              setSelectedProperty(null)
              setPropertyModalOpen(true)
            }}
            className="flex items-center space-x-2 bg-[#16834B] hover:bg-[#126b3d] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Property</span>
          </button>
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-green-50 text-[#16834B] rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-gray-400">Total Properties</span>
              <p className="text-2xl font-black text-gray-900">{properties.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-yellow-50 text-[#F4C430] rounded-xl">
              <Star className="w-6 h-6 fill-current text-[#F4C430]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-gray-400">Featured Listings</span>
              <p className="text-2xl font-black text-gray-900">{properties.filter((p) => p.isFeatured).length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-gray-400">Inquiries Received</span>
              <p className="text-2xl font-black text-gray-900">{inquiries.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-gray-400">Visit Bookings</span>
              <p className="text-2xl font-black text-gray-900">{visits.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 bg-white px-4 rounded-xl border space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('properties')}
            className={`py-4 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'properties' ? 'border-[#16834B] text-[#16834B]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-4 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'inquiries' ? 'border-[#16834B] text-[#16834B]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`py-4 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'visits' ? 'border-[#16834B] text-[#16834B]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Visits ({visits.length})
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`py-4 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'agents' ? 'border-[#16834B] text-[#16834B]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Agents ({agents.length})
          </button>
        </div>

        {/* Tab 1: Properties Table */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Property</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Purpose</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900 max-w-xs">
                        <div className="line-clamp-1">{prop.title}</div>
                        <div className="text-[10px] text-gray-400 font-normal">ID: {prop.id}</div>
                      </td>
                      <td className="p-4">{prop.area}, {prop.city}</td>
                      <td className="p-4 font-bold text-[#16834B]">{formatPKRPrice(prop.price)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                          prop.purpose === 'FOR_SALE' ? 'bg-[#16834B]' : 'bg-blue-600'
                        }`}>
                          {prop.purpose}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-800">
                          {prop.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProperty(prop)
                            setPropertyModalOpen(true)
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inquiries Table */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Property</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{inq.name}</td>
                      <td className="p-4 space-y-0.5">
                        <div>{inq.phone}</div>
                        <div className="text-gray-400">{inq.email}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate font-medium text-gray-800">
                        {inq.property?.title || 'General Inquiry'}
                      </td>
                      <td className="p-4 max-w-xs line-clamp-2 text-gray-600">{inq.message}</td>
                      <td className="p-4">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-xs rounded p-1 font-semibold focus:ring-1 focus:ring-[#16834B]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Visits Table */}
        {activeTab === 'visits' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Property</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {visits.map((vis) => (
                    <tr key={vis.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">
                        {vis.name}
                        <div className="text-gray-400 font-normal">{vis.phone}</div>
                      </td>
                      <td className="p-4 font-medium max-w-xs truncate text-gray-800">{vis.property?.title}</td>
                      <td className="p-4">
                        {new Date(vis.preferredDate).toLocaleDateString()} ({vis.preferredTime})
                      </td>
                      <td className="p-4">
                        <select
                          value={vis.status}
                          onChange={(e) => handleUpdateVisitStatus(vis.id, e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-xs rounded p-1 font-semibold focus:ring-1 focus:ring-[#16834B]"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="REJECTED">REJECTED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Agents Table */}
        {activeTab === 'agents' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Agent Name</th>
                    <th className="p-4">Agency</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Properties</th>
                    <th className="p-4">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {agents.map((agt) => (
                    <tr key={agt.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{agt.name}</td>
                      <td className="p-4 font-semibold text-[#16834B]">{agt.agency}</td>
                      <td className="p-4">
                        <div>{agt.phone}</div>
                        <div className="text-gray-400">{agt.email}</div>
                      </td>
                      <td className="p-4 font-bold">{agt._count?.properties || 0}</td>
                      <td className="p-4">
                        {agt.isVerified ? (
                          <span className="text-green-600 font-bold flex items-center space-x-1">
                            <ShieldCheck className="w-4 h-4 text-[#16834B]" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-gray-400">Standard</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Property Form Modal */}
      <PropertyFormModal
        isOpen={propertyModalOpen}
        onClose={() => setPropertyModalOpen(false)}
        onSuccess={fetchData}
        initialData={selectedProperty}
      />

      <Footer />
    </div>
  )
}
