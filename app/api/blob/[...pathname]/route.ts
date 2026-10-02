import { NextResponse } from 'next/server'
import { get } from '@vercel/blob'

// Vercel Blob's server SDK requires the Node runtime.
export const runtime = 'nodejs'

// Only blobs uploaded by this app live under this prefix. Restricting reads to
// it prevents path traversal and stops the proxy from being used to reach any
// unrelated object in the (private) store.
const ALLOWED_PREFIX = 'properties/'

/**
 * Private Blob media proxy.
 *
 * The Vercel Blob store is PRIVATE, so a stored blob URL cannot be rendered
 * directly by the browser. Property images are therefore stored as
 * `/api/blob/<pathname>` and served through this route:
 *
 *   Browser <img src="/api/blob/properties/xyz.jpg">
 *     -> this route (Node runtime)
 *     -> get(pathname, { access: 'private' })  [server-side, uses the RW token]
 *     -> streamed image bytes back to the browser
 *
 * The read-write token never leaves the server and the private file is never
 * made public. Responses are cached immutably at the CDN (blob pathnames carry
 * a random suffix and never change), so an image is not re-downloaded from
 * origin on every page request.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pathname: string[] }> },
) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Media storage is not configured on this server.' },
      { status: 503 },
    )
  }

  const { pathname: segments } = await params
  const pathname = (segments ?? []).join('/')

  // Reject traversal / out-of-scope reads before touching storage.
  if (!pathname || pathname.includes('..') || !pathname.startsWith(ALLOWED_PREFIX)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const result = await get(pathname, { access: 'private' })

    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const contentType = result.blob.contentType || 'application/octet-stream'

    return new Response(result.stream as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Immutable: the pathname includes a random suffix and content never changes.
        'Cache-Control': 'public, max-age=31536000, immutable',
        ETag: result.blob.etag,
      },
    })
  } catch (error) {
    console.error('[API_BLOB_MEDIA]', error)
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 })
  }
}
