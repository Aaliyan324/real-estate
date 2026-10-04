import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { serviceProviderRepository, serviceRequestRepository, serviceJobRepository } from '@/lib/db'
import ProviderDashboardClient from './ProviderDashboardClient'

export default async function ProviderDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?callbackUrl=/provider/dashboard')
  }

  if (user.role !== 'SERVICE_PROVIDER' && user.role !== 'ADMIN') {
    redirect('/login?error=unauthorized')
  }

  const provider = await serviceProviderRepository.findByUserId(user.id)

  if (!provider) {
    // If account role is SERVICE_PROVIDER but profile does not exist yet, redirect to registration
    redirect('/provider/register')
  }

  const categoryIds = provider.categories.map((c) => c.categoryId)

  const [eligibleRequests, activeJobs] = await Promise.all([
    provider.verificationStatus === 'APPROVED' && !provider.isBlocked
      ? serviceRequestRepository.findEligibleForProvider(provider.id, categoryIds)
      : Promise.resolve([]),
    serviceJobRepository.findByProviderId(provider.id),
  ])

  return (
    <ProviderDashboardClient
      user={user}
      provider={JSON.parse(JSON.stringify(provider))}
      eligibleRequests={JSON.parse(JSON.stringify(eligibleRequests))}
      activeJobs={JSON.parse(JSON.stringify(activeJobs))}
      feeLedger={JSON.parse(JSON.stringify(provider.fees || []))}
    />
  )
}

