import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { prisma } from '@/lib/prisma'
import {
  Search,
  Building2,
  Home as HomeIcon,
  Building,
  Store,
  Briefcase,
  ShieldCheck,
  Users,
  Calendar,
  Calculator,
  ArrowRight,
  MapPin,
} from 'lucide-react'

export const metadata = {
  title: 'PakHaven | Pakistan Real Estate Marketplace - Buy, Sell & Rent Properties',
  description: 'Search verified houses, apartments, plots, and commercial properties for sale and rent in Lahore, Islamabad, Karachi, Rawalpindi, DHA, and Bahria Town.',
}

const PROPERTY_TYPES = [
  { name: 'Houses', type: 'HOUSE', icon: HomeIcon, count: '1,200+' },
  { name: 'Apartments', type: 'APARTMENT', icon: Building2, count: '850+' },
  { name: 'Plots', type: 'PLOT', icon: MapPin, count: '2,400+' },
  { name: 'Commercial', type: 'COMMERCIAL', icon: Building, count: '430+' },
  { name: 'Offices', type: 'OFFICE', icon: Briefcase, count: '310+' },
  { name: 'Shops', type: 'SHOP', icon: Store, count: '520+' },
]

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
  let featuredProperties: any[] = []
  try {
    featuredProperties = await prisma.property.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    })

    if (featuredProperties.length === 0) {
      featuredProperties = await prisma.property.findMany({
        where: { status: 'PUBLISHED' },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { images: true },
      })
    }
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
              <span>Pakistan&apos;s #1 Verified Real Estate Platform</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Find a place you&apos;ll love to call <span className="text-[#F4C430]">home.</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Explore thousands of verified houses, modern apartments, and plots for sale or rent across Lahore, Islamabad, Karachi, and major cities.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-gray-900 text-left max-w-4xl mx-auto space-y-4">
            <form action="/properties" method="GET" className="space-y-4">
              {/* Purpose Radio Pills */}
              <div className="flex space-x-2 border-b border-gray-100 pb-3">
                <label className="flex items-center space-x-2 font-bold text-xs cursor-pointer text-[#16834B] bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <input type="radio" name="purpose" value="FOR_SALE" defaultChecked className="accent-[#16834B]" />
                  <span>Buy Property</span>
                </label>
                <label className="flex items-center space-x-2 font-bold text-xs cursor-pointer text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <input type="radio" name="purpose" value="FOR_RENT" className="accent-[#16834B]" />
                  <span>Rent Property</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Location */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">City / Location</label>
                  <select
                    name="city"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  >
                    <option value="">All Pakistan</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Property Type</label>
                  <select
                    name="type"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="HOUSE">House</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="PLOT">Plot</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="OFFICE">Office</option>
                    <option value="FARM_HOUSE">Farm House</option>
                  </select>
                </div>

                {/* Search Term */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Area / Keyword</label>
                  <input
                    type="text"
                    name="query"
                    placeholder="e.g. Bahria, DHA..."
                    className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-[#16834B] hover:bg-[#126b3d] text-white font-bold text-xs py-3 rounded-lg transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Properties</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[#F4C430] font-black text-xs uppercase tracking-wider">
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

      {/* Browse by Property Type */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Browse by Property Type</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Choose from residential houses, luxury flats, plots, commercial offices, and shops across Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PROPERTY_TYPES.map((pt) => {
              const Icon = pt.icon
              return (
                <Link
                  key={pt.type}
                  href={`/properties?type=${pt.type}`}
                  className="bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-[#16834B] rounded-xl p-5 text-center transition group shadow-2xs space-y-3"
                >
                  <div className="w-12 h-12 mx-auto bg-white rounded-xl shadow-xs flex items-center justify-center text-[#16834B] group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#16834B] transition">{pt.name}</h3>
                    <p className="text-[11px] text-gray-500 font-semibold">{pt.count}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Explore Top Pakistani Cities</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Find premium properties in prime real estate hubs in Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_LOCATIONS.map((loc) => (
            <Link
              key={loc.city}
              href={`/properties?city=${loc.city}`}
              className="relative rounded-2xl overflow-hidden aspect-4/3 group shadow-md"
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
