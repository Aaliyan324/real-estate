import { put } from '@vercel/blob'
import path from 'path'
import type { StorageDriver, StoredFile } from './types'

const SUBDIR = 'properties'

/**
 * Vercel Blob driver (Vercel/serverless target).
 *
 * Enabled automatically when BLOB_READ_WRITE_TOKEN is configured. Persists
 * uploads to durable Blob storage and returns a public URL, since the
 * serverless filesystem is ephemeral. The token is read server-side only by
 * the SDK — never expose it as a NEXT_PUBLIC_* variable.
 */
export const vercelBlobStorageDriver: StorageDriver = {
  name: 'vercel-blob',
  async upload(file: File): Promise<StoredFile> {
    const bytes = Buffer.from(await file.arrayBuffer())
    const ext = path.extname(file.name) || '.jpg'
    const sanitized = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()

    const blob = await put(`${SUBDIR}/${Date.now()}-${sanitized}${ext}`, bytes, {
      access: 'public',
      addRandomSuffix: true,
    })

    return { url: blob.url }
  },
}
