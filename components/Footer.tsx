import React from 'react'
import Link from 'next/link'
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-gray-300 border-t-4 border-[#16834B]">
      {/* Top Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand & About */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl">
            <div className="bg-[#16834B] text-white p-2 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white">PakHaven</span>
              <span className="text-[10px] tracking-wider text-[#F4C430] font-bold uppercase">Real Estate Marketplace</span>
            </div>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed pr-4">
            PakHaven is Pakistan&apos;s premier real estate platform connecting buyers, renters, sellers, and verified real estate agents across Lahore, Islamabad, Karachi, Rawalpindi, and key cities nationwide.
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-[#16834B]" />
            <span>100% Verified Properties & Direct Agent Contact</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/properties?purpose=FOR_SALE" className="hover:text-white hover:underline flex items-center space-x-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F4C430]" />
                <span>Houses for Sale</span>
              </Link>
            </li>
            <li>
              <Link href="/properties?purpose=FOR_RENT" className="hover:text-white hover:underline flex items-center space-x-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F4C430]" />
                <span>Apartments for Rent</span>
              </Link>
            </li>
            <li>
              <Link href="/properties?type=PLOT" className="hover:text-white hover:underline flex items-center space-x-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F4C430]" />
                <span>Plots & Land</span>
              </Link>
            </li>
            <li>
              <Link href="/properties?type=COMMERCIAL" className="hover:text-white hover:underline flex items-center space-x-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F4C430]" />
                <span>Commercial Properties</span>
              </Link>
            </li>
            <li>
              <Link href="/agents" className="hover:text-white hover:underline flex items-center space-x-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F4C430]" />
                <span>Find Real Estate Agents</span>
              </Link>
            </li>
            <li>
              <Link href="/mortgage-calculator" className="hover:text-white hover:underline flex items-center space-x-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F4C430]" />
                <span>Home Loan Calculator</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Locations */}
        <div>
          <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">
            Top Locations
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/properties?city=Lahore" className="hover:text-white hover:underline">
                DHA & Bahria Town Lahore
              </Link>
            </li>
            <li>
              <Link href="/properties?city=Islamabad" className="hover:text-white hover:underline">
                CDA Sectors & Gulberg Islamabad
              </Link>
            </li>
            <li>
              <Link href="/properties?city=Karachi" className="hover:text-white hover:underline">
                Clifton & DHA Karachi
              </Link>
            </li>
            <li>
              <Link href="/properties?city=Rawalpindi" className="hover:text-white hover:underline">
                Bahria Town Rawalpindi
              </Link>
            </li>
            <li>
              <Link href="/properties?city=Faisalabad" className="hover:text-white hover:underline">
                Civil Lines & Canal Road Faisalabad
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#F4C430] shrink-0 mt-0.5" />
              <span>Main Boulevard, Phase 6 DHA, Lahore, Pakistan</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-[#16834B] shrink-0" />
              <span>+92 42 111 222 333</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-[#16834B] shrink-0" />
              <span>support@pakhaven.pk</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#111827] border-t border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} PakHaven Real Estate. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-white">About Us</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <span className="text-gray-600">•</span>
            <span className="flex items-center text-gray-400">
              Designed with <Heart className="w-3.5 h-3.5 text-red-500 mx-1 fill-current" /> for Pakistan
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
