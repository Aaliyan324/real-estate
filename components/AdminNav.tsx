'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Wrench, Briefcase, Users, MessageSquare, ShieldCheck, DollarSign } from 'lucide-react'

export default function AdminNav() {
  const pathname = usePathname()
  const [pendingProvidersCount, setPendingProvidersCount] = useState<number>(0)

  useEffect(() => {
    fetch('/api/admin/providers')
      .then((res) => res.json())
      .then((data) => {
        if (data.pendingCount !== undefined) {
          setPendingProvidersCount(data.pendingCount)
        } else if (data.providers) {
          const pending = data.providers.filter((p: any) => p.verificationStatus === 'PENDING').length
          setPendingProvidersCount(pending)
        }
      })
      .catch(() => {})
  }, [pathname])

  const navItems = [
    {
      label: 'Properties & Agents',
      href: '/admin',
      icon: Building2,
      exact: true,
    },
    {
      label: 'Service Providers',
      href: '/admin/providers',
      icon: Wrench,
      badge: pendingProvidersCount > 0 ? `Pending: ${pendingProvidersCount}` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      label: 'Service Jobs & Marketplace',
      href: '/admin/marketplace',
      icon: Briefcase,
    },
  ]

  return (
    <div className="bg-white border-b border-gray-200 shadow-xs max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-1 no-scrollbar max-w-full">
            <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider shrink-0 hidden sm:inline mr-1">
              Admin Portal:
            </span>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#16834B] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-[11px] text-gray-500 font-semibold shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#16834B]" />
            <span>Administrator Access Authorized</span>
          </div>
        </div>
      </div>
    </div>
  )
}

