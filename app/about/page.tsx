import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Building2, ShieldCheck, Target, Award, Users } from 'lucide-react'

export const metadata = {
  title: 'About Us | PakHaven Real Estate',
  description: 'Learn about PakHaven, Pakistan premier real estate portal connecting buyers, renters, and trusted agencies.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-xs text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase text-[#16834B] tracking-wider">About PakHaven</span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Transforming Real Estate in Pakistan</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            PakHaven was founded with a singular mission: to provide Pakistan with a clean, fast, transparent, and trustworthy property marketplace. Whether buying your first 5 Marla house or leasing a commercial sea view office, PakHaven provides verified listings and direct agent access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
            <div className="p-3 bg-green-50 text-[#16834B] rounded-xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Verified Listings Only</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We audit property listings to ensure buyers and renters receive accurate specs, real photos, and verified location info.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
            <div className="p-3 bg-yellow-50 text-[#F4C430] rounded-xl w-fit">
              <Target className="w-6 h-6 text-[#1F2937]" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Market Focus</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Deep localization tailored specifically for Pakistani property units (Marla, Kanal, Sq. Ft.) and key housing societies (DHA, Bahria, CDA).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Direct Communication</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Instant WhatsApp integration and direct phone calls with certified property consultants.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
