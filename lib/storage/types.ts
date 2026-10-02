/**
 * Pluggable file-storage abstraction.
 *
 * Vercel's serverless filesystem is ephemeral, so writing uploads to disk (as
 * the previous upload route did) is not viable there. All upload code depends
 * on this interface instead of a concrete backend, so images can be moved to
 * Vercel Blob, Cloudinary, S3, or Hostinger local disk without touching
 * property functionality. See lib/storage/index.ts for driver selection.
 */
export interface StoredFile {
  /** Value persisted in `PropertyImage.url` and used as the browser `<img src>`. */
  url: string
  /**
   * Blob pathname/key, returned only by remote drivers whose storage is
   * private (e.g. Vercel Blob). Not needed by the local filesystem driver, so
   * it is optional to stay backwards-compatible.
   */
  pathname?: string
}

export interface StorageDriver {
  readonly name: string
  upload(file: File): Promise<StoredFile>
}
