import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard, { PropertyCardProps } from '@/components/PropertyCard'
import HeroSearch from '@/components/HeroSearch'
import { propertyRepository } from '@/lib/db'
import {
  ShieldCheck,
  Users,
  Calendar,
  Calculator,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export const metadata = {
  title: 'PakHaven | Pakistan Real Estate Marketplace - Buy, Sell & Rent Properties',
  description:
    'Search verified houses, apartments, plots, and commercial properties for sale and rent in Lahore, Islamabad, Karachi, Rawalpindi, DHA, and Bahria Town.',
}

const POPULAR_LOCATIONS = [
  {
    city: 'Lahore',
    desc: 'DHA, Bahria Town, Gulberg & Johar Town',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
  },
  {
    city: 'Islamabad',
    desc: 'F-11, E-11, Gulberg Greens & G-Sectors',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  },
  {
    city: 'Karachi',
    desc: 'Clifton, DHA Phase 8, PECHS & Gulshan',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
  },
  {
    city: 'Rawalpindi',
    desc: 'Bahria Town, Saddar, Chaklala Scheme',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
  },
]

export default async function HomePage() {
  let featuredProperties: PropertyCardProps['property'][] = []
  try {
    featuredProperties = await propertyRepository.findFeaturedForHome(6)
  } catch (err) {
    console.error('Homepage fetch error:', err)
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1F2937] via-[#111827] to-[#16834B] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative Background Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#16834B_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#F4C430] border border-white/20">
              <ShieldCheck className="w-4 h-4 text-[#F4C430]" />
              <span>Pakistan&apos;s #1 Verified Real Estate Marketplace</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Find a place you&apos;ll love to call <span className="text-[#F4C430]">home.</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Explore thousands of verified houses, modern apartments, and plots for sale or rent across Lahore, Islamabad, Karachi, and major cities nationwide.
            </p>
          </div>

          {/* OLX-Style Prominent Search Hero Box */}
          <HeroSearch />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[#F4C430] font-black text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-[#16834B]" />
              <span>★ Handpicked Listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Featured Properties</h2>
          </div>
          <Link
            href="/properties"
            className="text-xs font-bold text-[#16834B] hover:text-[#126b3d] flex items-center space-x-1"
          >
            <span>View All Listings ({featuredProperties.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="p-8 bg-white rounded-xl text-center text-gray-500">No properties available currently.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Explore Top Pakistani Real Estate Hubs</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Find premium residential and commercial properties in prime Pakistani locations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_LOCATIONS.map((loc) => (
            <Link
              key={loc.city}
              href={`/properties?city=${loc.city}`}
              className="relative rounded-2xl overflow-hidden aspect-4/3 group shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={loc.image}
                alt={loc.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-end text-white space-y-1">
                <h3 className="text-xl font-black">{loc.city}</h3>
                <p className="text-xs text-gray-200 font-medium">{loc.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Why Choose PakHaven</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              We make buying, renting, and selling property seamless, transparent, and trustworthy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 text-center space-y-3 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 text-[#16834B] rounded-2xl mx-auto flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Verified Listings</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every property on PakHaven is thoroughly vetted for accurate specs, genuine images, and legal peace of mind.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center space-y-3 border border-gray-100">
              <div className="w-14 h-14 bg-yellow-100 text-[#F4C430] rounded-2xl mx-auto flex items-center justify-center">
                <Users className="w-7 h-7 text-[#1F2937]" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Trusted Agents</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect directly with top certified real estate agencies in DHA, Bahria Town, and CDA sectors without middleman markups.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center space-y-3 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 text-[#16834B] rounded-2xl mx-auto flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Easy Visit Scheduling</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Book physical property visits in seconds online. Receive instant confirmation from assigned agents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mortgage Calculator Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="bg-[#1F2937] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border-l-8 border-[#F4C430]">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase text-[#F4C430] tracking-wider">Home Financing Tool</span>
            <h2 className="text-2xl sm:text-3xl font-black">Calculate Your Monthly Payment</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Planning to finance a home in Pakistan? Use our free mortgage loan calculator to compute monthly installments, down payments, and total interest.
            </p>
          </div>

          <Link
            href="/mortgage-calculator"
            className="bg-[#16834B] hover:bg-[#126b3d] text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shrink-0 text-sm flex items-center space-x-2"
          >
            <Calculator className="w-5 h-5 text-[#F4C430]" />
            <span>Open Loan Calculator</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
