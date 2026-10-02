import { put } from '@vercel/blob'
import path from 'path'
import type { StorageDriver, StoredFile } from './types'

const SUBDIR = 'properties'

/**
 * Vercel Blob driver (Vercel/serverless target).
 *
 * Enabled automatically when BLOB_READ_WRITE_TOKEN is configured. The Blob
 * store is intentionally PRIVATE, so blobs are uploaded with
 * `access: 'private'` and their stored `url` is NOT publicly fetchable.
 *
 * Instead of returning the private blob URL (which would 401 in the browser),
 * we return a relative proxy path (`/api/blob/<pathname>`) that the app's
 * media route streams through an authenticated, server-side
 * `get(pathname, { access: 'private' })` call. The read-write token therefore
 * never leaves the server and private files never become public.
 *
 * The token is read server-side only by the SDK — never expose it as a
 * NEXT_PUBLIC_* variable. This module is server-only.
 */
export const vercelBlobStorageDriver: StorageDriver = {
  name: 'vercel-blob',
  async upload(file: File): Promise<StoredFile> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Surface as a distinct, loggable configuration error; the caller maps it
      // to a safe client message rather than an unexplained crash.
      throw new BlobConfigError(
        'Vercel Blob is not configured: BLOB_READ_WRITE_TOKEN is missing.',
      )
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const ext = path.extname(file.name) || '.jpg'
    const sanitized = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

    const blob = await put(`${SUBDIR}/${Date.now()}-${sanitized}${ext}`, bytes, {
      access: 'private',
      addRandomSuffix: true,
    })

    // Serve through the private-blob media proxy, keyed by the blob pathname.
    return { url: `/api/blob/${blob.pathname}`, pathname: blob.pathname }
  },
}

/** Typed marker so upload handlers can distinguish a config problem from a
 *  generic storage failure. */
export class BlobConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BlobConfigError'
  }
}
