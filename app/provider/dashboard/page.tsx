import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { serviceProviderRepository, serviceRequestRepository, serviceJobRepository, providerFeeRepository } from '@/lib/db'
import ProviderDashboardClient from './ProviderDashboardClient'

export default async function ProviderDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?callbackUrl=/provider/dashboard')
  }

  // Fetch provider profile by userId
  const provider = await serviceProviderRepository.findByUserId(user.id)

  if (!provider) {
    redirect('/provider/register')
  }

  // Fetch requests & jobs if approved
  const categoryIds = provider.categories.map((c) => c.categoryId)
  const cities = provider.locations.map((l) => l.cityName).filter(Boolean) as string[]

  const isApproved = provider.verificationStatus === 'APPROVED' && !provider.isBlocked

  const eligibleRequests = isApproved
    ? await serviceRequestRepository.findEligibleForProvider(provider.id, categoryIds, cities)
    : []

  const activeJobs = await serviceJobRepository.findByProviderId(provider.id)
  const feeLedger = await providerFeeRepository.findByProviderId(provider.id)

  return (
    <ProviderDashboardClient
      user={user}
      provider={provider}
      eligibleRequests={eligibleRequests}
      activeJobs={activeJobs}
      feeLedger={feeLedger}
    />
  )
}
