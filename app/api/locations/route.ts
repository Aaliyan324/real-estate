import { NextResponse } from 'next/server'
import { propertyRepository } from '@/lib/db'
import { searchLocations, LocationItem } from '@/lib/locationsData'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    
    if (!q || q.trim().length < 1) {
      return NextResponse.json({ suggestions: [] })
    }

    const cleanQ = q.trim().toLowerCase()

    // 1. Static location suggestions
    const staticSuggestions = searchLocations(cleanQ, 10)

    // 2. Dynamic DB locations matching query
    const dbSuggestions: LocationItem[] = []
    try {
      const dbProperties = await propertyRepository.findLocationsByQuery(cleanQ)

      const seen = new Set<string>()

      for (const p of dbProperties) {
        if (p.city && p.city.toLowerCase().includes(cleanQ)) {
          const key = `db-city-${p.city.toLowerCase()}`
          if (!seen.has(key)) {
            seen.add(key)
            dbSuggestions.push({
              id: key,
              name: p.city,
              city: p.city,
              type: 'CITY',
              displayName: `${p.city} (City)`,
            })
          }
        }

        if (p.area && p.area.toLowerCase().includes(cleanQ)) {
          const key = `db-area-${p.area.toLowerCase()}-${p.city.toLowerCase()}`
          if (!seen.has(key)) {
            seen.add(key)
            dbSuggestions.push({
              id: key,
              name: p.area,
              city: p.city,
              type: 'AREA',
              displayName: `${p.area} (Area, ${p.city})`,
            })
          }
        }

        if (p.society && p.society.toLowerCase().includes(cleanQ)) {
          const key = `db-society-${p.society.toLowerCase()}-${p.city.toLowerCase()}`
          if (!seen.has(key)) {
            seen.add(key)
            dbSuggestions.push({
              id: key,
              name: p.society,
              city: p.city,
              type: 'SOCIETY',
              displayName: `${p.society} (${p.city})`,
            })
          }
        }
      }
    } catch {
      // Fallback to static if DB query fails
    }

    // Merge static and dynamic, deduplicate by normalized displayName
    const combined: LocationItem[] = []
    const seenNames = new Set<string>()

    for (const item of [...staticSuggestions, ...dbSuggestions]) {
      const norm = item.displayName.toLowerCase()
      if (!seenNames.has(norm)) {
        seenNames.add(norm)
        combined.push(item)
      }
    }

    // Prioritize startsWith, limit to 8
    const startsWith = combined.filter((i) => i.name.toLowerCase().startsWith(cleanQ) || i.city.toLowerCase().startsWith(cleanQ))
    const others = combined.filter((i) => !startsWith.includes(i))

    const finalSuggestions = [...startsWith, ...others].slice(0, 8)

    return NextResponse.json({ suggestions: finalSuggestions })
  } catch (error) {
    console.error('Locations API error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
