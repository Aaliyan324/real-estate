import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getStorageDriver, BlobConfigError } from '@/lib/storage'

// Vercel Blob + Prisma are Node-based; keep this route on the Node runtime
// rather than Edge (requirement: avoid Node-only APIs on Edge routes).
export const runtime = 'nodejs'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse multipart body defensively: a malformed/truncated form-data request
  // throws here, so it must not escape as an unhandled 500.
  let files: File[]
  try {
    const formData = await request.formData()
    files = formData.getAll('files') as File[]
  } catch {
    return NextResponse.json({ error: 'Malformed upload request' }, { status: 400 })
  }

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
  }

  // Validate every file up front (type + size) before touching storage, so an
  // invalid request fails fast with a 400 and nothing is partially uploaded.
  for (const file of files) {
    if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type for ${file.name || 'upload'} (allowed: JPEG, PNG, WEBP)` },
        { status: 400 },
      )
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File ${file.name} exceeds maximum allowed size of 5MB` },
        { status: 400 },
      )
    }
  }

  try {
    const storage = getStorageDriver()
    const savedUrls: string[] = []

    for (const file of files) {
      const { url } = await storage.upload(file)
      savedUrls.push(url)
    }

    return NextResponse.json({ success: true, urls: savedUrls })
  } catch (error) {
    console.error('[API_UPLOAD]', error)

    // Missing/invalid Blob configuration: a clear, safe configuration message
    // instead of an unexplained crash.
    if (error instanceof BlobConfigError) {
      return NextResponse.json(
        { error: 'File storage is not configured on this server. Please contact support.' },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 })
  }
}
