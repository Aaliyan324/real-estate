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
  url: string
}

export interface StorageDriver {
  readonly name: string
  upload(file: File): Promise<StoredFile>
}
