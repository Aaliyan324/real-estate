'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, X, Building, Map, Compass } from 'lucide-react'
import { searchLocations, LocationItem } from '@/lib/locationsData'

interface LocationSearchProps {
  value: string
  onChangeText: (text: string) => void
  onSelectLocation?: (loc: { city: string; areaOrKeyword: string; displayName: string }) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}

export default function LocationSearch({
  value,
  onChangeText,
  onSelectLocation,
  placeholder = 'Type city, area, society (e.g. Johar Town, DHA, Islamabad)...',
  className = '',
  inputClassName = '',
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<LocationItem[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [loading, setLoading] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch or filter suggestions when input value changes
  const fetchSuggestions = useCallback(async (query: string) => {
    const cleanQuery = query.trim()
    if (!cleanQuery) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    // 1. Initial static filter for instantaneous response
    const staticResults = searchLocations(cleanQuery, 8)
    setSuggestions(staticResults)
    setIsOpen(true)
    setHighlightedIndex(-1)

    // 2. Fetch API for merged DB + static results
    try {
      const res = await fetch(`/api/locations?q=${encodeURIComponent(cleanQuery)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions)
        }
      }
    } catch {
      // Keep static results
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChangeText(val)
    fetchSuggestions(val)
  }

  const handleSelect = (item: LocationItem) => {
    onChangeText(item.displayName)
    setIsOpen(false)
    setHighlightedIndex(-1)
    if (onSelectLocation) {
      onSelectLocation({
        city: item.type === 'CITY' ? item.city : item.city,
        areaOrKeyword: item.type === 'CITY' ? '' : item.name,
        displayName: item.displayName,
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault()
        handleSelect(suggestions[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    onChangeText('')
    setSuggestions([])
    setIsOpen(false)
    if (onSelectLocation) {
      onSelectLocation({ city: '', areaOrKeyword: '', displayName: '' })
    }
  }

  const getTypeIcon = (type: LocationItem['type']) => {
    switch (type) {
      case 'CITY':
        return <Building className="w-3.5 h-3.5 text-[#16834B] shrink-0" />
      case 'SOCIETY':
        return <Map className="w-3.5 h-3.5 text-blue-600 shrink-0" />
      case 'AREA':
      default:
        return <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
    }
  }

  const getTypeBadge = (type: LocationItem['type']) => {
    switch (type) {
      case 'CITY':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-[#16834B]">City</span>
      case 'SOCIETY':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Society</span>
      case 'AREA':
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Area</span>
    }
  }

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 z-10 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.trim()) fetchSuggestions(value)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-xs font-medium rounded-lg focus:ring-2 focus:ring-[#16834B] focus:border-[#16834B] focus:outline-none transition ${inputClassName}`}
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1 cursor-pointer z-10"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {/* OLX-Style Autocomplete Dropdown Panel */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-fade-in divide-y divide-gray-100">
          <div className="px-3 py-1.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500 flex justify-between items-center">
            <span>Location Suggestions</span>
            {loading && <span className="text-xs text-[#16834B] font-normal">Searching...</span>}
          </div>

          {suggestions.map((item, idx) => {
            const isHighlighted = idx === highlightedIndex
            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition text-xs ${
                  isHighlighted ? 'bg-green-50 text-[#16834B] font-semibold' : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  {getTypeIcon(item.type)}
                  <span className="truncate">{item.displayName}</span>
                </div>
                <div className="shrink-0">{getTypeBadge(item.type)}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
