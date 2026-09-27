import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MortgageCalculator from '@/components/MortgageCalculator'

export const metadata = {
  title: 'Pakistani Home Loan & Mortgage Calculator | PakHaven',
  description: 'Calculate monthly home loan installments, interest rates, down payments, and total financing costs for property in Pakistan.',
}

export default function MortgageCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#F5F7F6] flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <MortgageCalculator />
      </main>

      <Footer />
    </div>
  )
}
