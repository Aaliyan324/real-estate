import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { agentRepository } from '@/lib/db'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { ShieldCheck, Phone, MessageCircle, Mail, Building2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const agent = await agentRepository.getBySlugForMeta(slug)

    if (!agent) {
      return { title: 'Agent Profile | PakHaven' }
    }

    return {
      title: `${agent.name} - ${agent.agency} | PakHaven Real Estate`,
      description: `Contact ${agent.name} from ${agent.agency}. View active properties for sale and rent in Pakistan.`,
    }
  } catch {
    return { title: 'Agent Profile | PakHaven' }
  }
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params

  let agent = null
  try {
    agent = await agentRepository.getBySlugWithProperties(slug)
  } catch (err) {
    console.error(err)
  }

  if (!agent) {
    notFound()
  }

  const whatsappNum = agent.whatsapp || agent.phone.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hello ${agent.name}, I am contacting you via PakHaven Real Estate.`)}`

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Agent Profile Banner */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#16834B] bg-gray-100 shrink-0 shadow-md">
            <img
              src={agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
              alt={agent.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{agent.name}</h1>
              {agent.isVerified && (
                <span className="inline-flex items-center text-xs font-bold text-[#16834B] bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                  <ShieldCheck className="w-4 h-4 mr-1 text-[#16834B]" /> Verified Partner
                </span>
              )}
            </div>

            <p className="text-base font-bold text-[#16834B] flex items-center justify-center md:justify-start space-x-1">
              <Building2 className="w-4 h-4" />
              <span>{agent.agency}</span>
            </p>

            {agent.bio && <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">{agent.bio}</p>}

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href={`tel:${agent.phone}`}
                className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-lg transition"
              >
                <Phone className="w-4 h-4 text-[#16834B]" />
                <span>{agent.phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`mailto:${agent.email}`}
                className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-lg transition"
              >
                <Mail className="w-4 h-4 text-[#16834B]" />
                <span>{agent.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Properties Listed */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-xl font-bold text-gray-900">Properties Listed by {agent.name} ({agent.properties.length})</h2>
          </div>

          {agent.properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
              No active listings currently published by this agent.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agent.properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
