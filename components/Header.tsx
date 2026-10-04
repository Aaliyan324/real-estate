'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Building2,
  Heart,
  Calculator,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Phone,
  Home,
  Search,
  ChevronDown,
  Building,
  Store,
  Briefcase,
  Trees,
  MapPin,
  Wrench,
} from 'lucide-react'

interface UserSession {
  id: string
  name: string
  email: string
  role: string
}

const CATEGORY_ITEMS = [
  { name: 'Houses', type: 'HOUSE', icon: Home, desc: 'Residential houses & villas' },
  { name: 'Apartments / Flats', type: 'APARTMENT', icon: Building2, desc: 'Modern flats & penthouses' },
  { name: 'Plots & Land', type: 'PLOT', icon: MapPin, desc: 'Residential & commercial plots' },
  { name: 'Commercial Properties', type: 'COMMERCIAL', icon: Building, desc: 'Plazas, buildings & centers' },
  { name: 'Offices', type: 'OFFICE', icon: Briefcase, desc: 'Executive corporate offices' },
  { name: 'Shops', type: 'SHOP', icon: Store, desc: 'Retail shops & commercial spaces' },
  { name: 'Farm Houses', type: 'FARM_HOUSE', icon: Trees, desc: 'Luxury farmhouses & land' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserSession | null>(null)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)

  const categoryRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setUserDropdownOpen(false)
    router.refresh()
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Banner Contact Line */}
      <div className="bg-[#1F2937] text-gray-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-[#F4C430]" />
              <span>Helpline: +92 42 111 222 333</span>
            </span>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline">Pakistan&apos;s Verified Real Estate Marketplace</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/mortgage-calculator" className="hover:text-white transition flex items-center space-x-1">
              <Calculator className="w-3.5 h-3.5 text-[#F4C430]" />
              <span>Loan Calculator</span>
            </Link>
            <Link href="/favorites" className="hover:text-white transition flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
              <span>Favorites</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-[#16834B] font-bold text-xl tracking-tight">
            <div className="bg-[#16834B] text-white p-2 rounded-lg shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl leading-none font-black text-[#16834B]">PakHaven</span>
              <span className="text-[10px] tracking-wider text-gray-500 font-semibold uppercase">Real Estate</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            <Link
              href="/"
              className={`transition-colors py-1 ${
                isActive('/') ? 'text-[#16834B] border-b-2 border-[#16834B]' : 'text-gray-700 hover:text-[#16834B]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/properties?purpose=FOR_SALE"
              className={`transition-colors py-1 ${
                pathname === '/properties' && isActive('/properties?purpose=FOR_SALE')
                  ? 'text-[#16834B] border-b-2 border-[#16834B]'
                  : 'text-gray-700 hover:text-[#16834B]'
              }`}
            >
              Buy
            </Link>
            <Link
              href="/properties?purpose=FOR_RENT"
              className={`transition-colors py-1 ${
                pathname === '/properties' && isActive('/properties?purpose=FOR_RENT')
                  ? 'text-[#16834B] border-b-2 border-[#16834B]'
                  : 'text-gray-700 hover:text-[#16834B]'
              }`}
            >
              Rent
            </Link>

            {/* Browse by Category Dropdown */}
            <div ref={categoryRef} className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center space-x-1 py-1 text-gray-700 hover:text-[#16834B] transition cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 divide-y divide-gray-100 animate-fade-in">
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Browse Categories
                  </div>
                  <div className="py-1">
                    {CATEGORY_ITEMS.map((cat) => {
                      const Icon = cat.icon
                      return (
                        <Link
                          key={cat.type}
                          href={`/properties?type=${cat.type}`}
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 hover:bg-green-50 transition group"
                        >
                          <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-[#16834B] text-gray-600 group-hover:text-white transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900 group-hover:text-[#16834B] transition">
                              {cat.name}
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium leading-tight">
                              {cat.desc}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/properties"
              className={`transition-colors py-1 ${
                isActive('/properties') ? 'text-[#16834B] border-b-2 border-[#16834B]' : 'text-gray-700 hover:text-[#16834B]'
              }`}
            >
              All Properties
            </Link>
            <Link
              href="/agents"
              className={`transition-colors py-1 ${
                isActive('/agents') ? 'text-[#16834B] border-b-2 border-[#16834B]' : 'text-gray-700 hover:text-[#16834B]'
              }`}
            >
              Agents
            </Link>
            <Link
              href="/home-services"
              className={`flex items-center space-x-1 transition-colors py-1 ${
                isActive('/home-services') ? 'text-[#16834B] border-b-2 border-[#16834B]' : 'text-gray-700 hover:text-[#16834B]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Services</span>
            </Link>
          </nav>

          {/* Desktop Right Action */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-800 transition cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#16834B]" />
                  <span>{user.name}</span>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500">
                      Signed in as <br />
                      <strong className="text-gray-800">{user.email}</strong>
                    </div>
                    {(user.role === 'ADMIN' || user.role === 'AGENT') && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[#16834B]"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    {user.role === 'PROVIDER' && (
                      <Link
                        href="/provider/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[#16834B]"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>Provider Dashboard</span>
                      </Link>
                    )}
                    <Link
                      href="/my-requests"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[#16834B]"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>My Service Requests</span>
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[#16834B]"
                    >
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Saved Properties</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-[#16834B] px-3 py-1.5 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-[#16834B] hover:bg-[#126b3d] text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-xs"
                >
                  Join / Add Property
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-[#16834B] hover:bg-gray-100 transition focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-base font-semibold text-gray-800 hover:text-[#16834B]"
          >
            <Home className="w-5 h-5 text-[#16834B]" />
            <span>Home</span>
          </Link>
          <Link
            href="/properties?purpose=FOR_SALE"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-base font-semibold text-gray-800 hover:text-[#16834B]"
          >
            <Search className="w-5 h-5 text-[#16834B]" />
            <span>Buy Properties</span>
          </Link>
          <Link
            href="/properties?purpose=FOR_RENT"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-base font-semibold text-gray-800 hover:text-[#16834B]"
          >
            <Building2 className="w-5 h-5 text-[#16834B]" />
            <span>Rent Properties</span>
          </Link>

          {/* Mobile Categories list */}
          <div className="border-y border-gray-100 py-2 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1 mb-1">Categories</div>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORY_ITEMS.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.type}
                    href={`/properties?type=${cat.type}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-green-50 hover:text-[#16834B]"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#16834B]" />
                    <span className="truncate">{cat.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <Link
            href="/home-services"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-base font-semibold text-gray-800 hover:text-[#16834B]"
          >
            <Wrench className="w-5 h-5 text-[#16834B]" />
            <span>Home Services</span>
          </Link>
          <Link
            href="/my-requests"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-base font-semibold text-gray-800 hover:text-[#16834B]"
          >
            <Wrench className="w-5 h-5 text-[#16834B]" />
            <span>My Service Requests</span>
          </Link>
          <Link
            href="/agents"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-base font-semibold text-gray-800 hover:text-[#16834B]"
          >
            <User className="w-5 h-5 text-[#16834B]" />
            <span>Agents Directory</span>
          </Link>
          <Link
            href="/mortgage-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-base font-semibold text-gray-800 hover:text-[#16834B]"
          >
            <Calculator className="w-5 h-5 text-[#F4C430]" />
            <span>Mortgage Calculator</span>
          </Link>
          <Link
            href="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-base font-semibold text-gray-800 hover:text-[#16834B]"
          >
            <Heart className="w-5 h-5 text-red-500" />
            <span>Saved Favorites</span>
          </Link>

          <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="py-2 text-sm font-semibold text-gray-700">
                  Signed in as <strong>{user.name}</strong>
                </div>
                {(user.role === 'ADMIN' || user.role === 'AGENT') && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-[#16834B] text-white py-2 rounded-lg font-semibold"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user.role === 'PROVIDER' && (
                  <Link
                    href="/provider/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-[#16834B] text-white py-2 rounded-lg font-semibold"
                  >
                    Provider Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-center border border-red-500 text-red-600 py-2 rounded-lg font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-[#16834B] text-white rounded-lg text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
