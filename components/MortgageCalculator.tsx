'use client'

import React, { useState } from 'react'
import { Calculator } from 'lucide-react'
import { formatPKRPrice } from '@/lib/utils'

export default function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(25000000) // PKR 2.5 Crore default
  const [downPaymentPercent, setDownPaymentPercent] = useState(20) // 20%
  const [loanTermYears, setLoanTermYears] = useState(20) // 20 years
  const [interestRate, setInterestRate] = useState(13.5) // 13.5%

  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100
  const loanAmount = propertyPrice - downPaymentAmount

  // Monthly Mortgage Formula: M = P [ r(1 + r)^n ] / [ (1 + r)^n – 1 ]
  const monthlyInterestRate = interestRate / 100 / 12
  const numberOfPayments = loanTermYears * 12

  let monthlyPayment = 0
  if (monthlyInterestRate > 0) {
    monthlyPayment =
      (loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
  } else {
    monthlyPayment = loanAmount / numberOfPayments
  }

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - loanAmount

  const principalRatio = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 50
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 lg:p-8 space-y-8">
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <div className="p-3 bg-green-100 text-[#16834B] rounded-xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pakistani Home Loan / Mortgage Calculator</h2>
          <p className="text-xs text-gray-500">Calculate estimated monthly installments and interest breakdown for home financing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Property Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700">
              <span>Property Price (PKR)</span>
              <span className="text-[#16834B] text-sm font-black">{formatPKRPrice(propertyPrice)}</span>
            </div>
            <input
              type="number"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 font-semibold text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
            />
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[5000000, 10000000, 25000000, 50000000, 100000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPropertyPrice(preset)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md border transition cursor-pointer ${
                    propertyPrice === preset
                      ? 'bg-[#16834B] text-white border-[#16834B]'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-[#16834B]'
                  }`}
                >
                  {formatPKRPrice(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Down Payment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700">
              <span>Down Payment ({downPaymentPercent}%)</span>
              <span className="text-gray-900">{formatPKRPrice(downPaymentAmount)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(parseInt(e.target.value, 10))}
              className="w-full accent-[#16834B] cursor-pointer"
            />
          </div>

          {/* Loan Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700">
              <span>Loan Duration ({loanTermYears} Years)</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[5, 10, 15, 20, 25].map((years) => (
                <button
                  key={years}
                  type="button"
                  onClick={() => setLoanTermYears(years)}
                  className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                    loanTermYears === years
                      ? 'bg-[#16834B] text-white border-[#16834B]'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-[#16834B]'
                  }`}
                >
                  {years} Yrs
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700">
              <span>Annual Interest Rate (%)</span>
              <span className="text-[#16834B] font-black">{interestRate}%</span>
            </div>
            <input
              type="number"
              step="0.5"
              min="5"
              max="30"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 font-semibold text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-[#16834B] focus:outline-none"
            />
          </div>
        </div>

        {/* Right Output Box */}
        <div className="bg-[#1F2937] text-white rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-lg">
          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-3">
              <span className="text-xs font-bold uppercase text-gray-400">Estimated Monthly Payment</span>
              <div className="text-3xl sm:text-4xl font-black text-[#F4C430] tracking-tight mt-1">
                {formatPKRPrice(Math.round(monthlyPayment))}
                <span className="text-xs font-normal text-gray-300"> / month</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2">
              <div className="space-y-1">
                <span className="text-gray-400">Loan Principal</span>
                <p className="text-white text-base font-bold">{formatPKRPrice(loanAmount)}</p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Total Interest</span>
                <p className="text-[#F4C430] text-base font-bold">{formatPKRPrice(Math.round(totalInterest))}</p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Total Outflow</span>
                <p className="text-white text-base font-bold">{formatPKRPrice(Math.round(totalPayment))}</p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">Down Payment</span>
                <p className="text-emerald-400 text-base font-bold">{formatPKRPrice(downPaymentAmount)}</p>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-1.5 pt-4">
              <div className="flex justify-between text-[11px] text-gray-400 font-bold">
                <span className="text-emerald-400">Principal ({principalRatio.toFixed(0)}%)</span>
                <span className="text-[#F4C430]">Interest ({interestRatio.toFixed(0)}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden flex">
                <div style={{ width: `${principalRatio}%` }} className="bg-[#16834B] h-full"></div>
                <div style={{ width: `${interestRatio}%` }} className="bg-[#F4C430] h-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/60 p-4 rounded-xl text-xs text-gray-300 leading-relaxed border border-gray-700">
            * Estimates are based on standard KIBOR/bank home finance calculation rules in Pakistan. Actual bank interest rates, processing fees, and insurance costs may vary.
          </div>
        </div>
      </div>
    </div>
  )
}
