import { NextResponse } from 'next/server'
import { agentRepository } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    const agents = await agentRepository.search(query)

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Fetch agents error:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}
