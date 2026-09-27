import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShieldCheck, Phone, MessageCircle, Building2, Search, Award } from 'lucide-react'

export const metadata = {
  title: 'Real Estate Agents & Agencies Directory | PakHaven',
  description: 'Find verified real estate agents, agencies, and consultants across Lahore, Islamabad, Karachi, DHA, and Bahria Town.',
}

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { isVerified: 'desc' },
    include: {
      _count: {
        select: { properties: true },
      },
    },
  })

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      {/* Hero Banner */}
      <div className="bg-[#16834B] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-3xl font-black">Verified Real Estate Agents & Agencies</h1>
          <p className="text-green-100 text-sm max-w-2xl">
            Connect directly with verified real estate consultants across Pakistan. No hidden fees or middleman charges.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {agents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            No agent profiles registered yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const whatsappNum = agent.whatsapp || agent.phone.replace(/[^0-9]/g, '')
              const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello ${agent.name}, I found your profile on PakHaven.`)}`

              return (
                <div key={agent.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-5">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#16834B] bg-gray-100 shrink-0">
                      <img
                        src={agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-base flex items-center space-x-1">
                        <span>{agent.name}</span>
                        {agent.isVerified && <ShieldCheck className="w-4 h-4 text-[#16834B]" title="Verified Agent" />}
                      </h3>
                      <p className="text-xs text-[#16834B] font-semibold">{agent.agency}</p>
                      <div className="text-xs text-gray-500 font-medium pt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-bold text-gray-700">
                          {agent._count.properties} Listed Properties
                        </span>
                      </div>
                    </div>
                  </div>

                  {agent.bio && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed italic border-t border-gray-100 pt-3">
                      &quot;{agent.bio}&quot;
                    </p>
                  )}

                  <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp</span>
                    </a>
                    <Link
                      href={`/agents/${agent.slug}`}
                      className="flex items-center justify-center space-x-1 bg-[#16834B] hover:bg-[#126b3d] text-white text-xs font-bold py-2 rounded-lg transition"
                    >
                      <span>View Profile</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
