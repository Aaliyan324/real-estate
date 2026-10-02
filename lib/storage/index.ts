import type { StorageDriver } from './types'
import { localStorageDriver } from './local'
import { vercelBlobStorageDriver } from './vercel-blob'

/**
 * Selects the active storage driver.
 *
 *   - BLOB_READ_WRITE_TOKEN set  -> Vercel Blob (Vercel/serverless)
 *   - otherwise                  -> local filesystem (Hostinger / local dev)
 *
 * Callers use `getStorageDriver().upload(file)` and never reference a concrete
 * backend, so switching providers is a configuration change, not a code change.
 * Server-only: do not import from Client Components.
 */
export function getStorageDriver(): StorageDriver {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return vercelBlobStorageDriver
  }
  return localStorageDriver
}

export type { StorageDriver, StoredFile } from './types'
export { localStorageDriver } from './local'
export { vercelBlobStorageDriver, BlobConfigError } from './vercel-blob'
