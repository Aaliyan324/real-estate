import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import type { StorageDriver, StoredFile } from './types'

const SUBDIR = 'properties'

function buildFileName(originalName: string): string {
  const ext = path.extname(originalName) || '.jpg'
  const sanitized = originalName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitized}${ext}`
}

/**
 * Local filesystem driver (Hostinger / local dev).
 *
 * Writes to `public/uploads/properties` and returns a static URL. Only
 * appropriate where the filesystem is persistent (Hostinger VPS/shared Node
 * hosting). NOT used on Vercel serverless — see vercel-blob.ts.
 */
export const localStorageDriver: StorageDriver = {
  name: 'local',
  async upload(file: File): Promise<StoredFile> {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', SUBDIR)
    await mkdir(uploadDir, { recursive: true })

    const bytes = Buffer.from(await file.arrayBuffer())
    const fileName = buildFileName(file.name)
    await writeFile(path.join(uploadDir, fileName), bytes)

    return { url: `/uploads/${SUBDIR}/${fileName}` }
  },
}
