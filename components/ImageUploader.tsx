'use client'

import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If a preview thumbnail cannot load (e.g. a private blob that is temporarily
  // unreachable, or a missing file), degrade gracefully instead of showing a
  // broken image icon. Guarded to avoid an onError reload loop.
  const handlePreviewError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (!img.src.startsWith('data:')) {
      img.src =
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">No preview</text></svg>`,
        )
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload images')
      }

      if (data.urls) {
        onChange([...images, ...data.urls])
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Upload failed')
      }
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  const setMainImage = (index: number) => {
    if (index === 0) return
    const selected = images[index]
    const filtered = images.filter((_, i) => i !== index)
    onChange([selected, ...filtered])
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 hover:border-[#16834B] rounded-xl p-6 text-center bg-gray-50 transition cursor-pointer relative">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-green-100 rounded-full text-[#16834B]">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold text-[#16834B]">Click to upload</span> or drag and drop property images
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB per file</p>
          {uploading && <p className="text-xs text-[#16834B] font-semibold animate-pulse">Uploading images...</p>}
        </div>
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{error}</p>}

      {/* Thumbnails grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-4/3 bg-gray-100">
              <img src={url} alt={`Property preview ${idx}`} className="w-full h-full object-cover" onError={handlePreviewError} />
              <div className="absolute top-1 right-1 flex space-x-1">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {idx === 0 ? (
                <span className="absolute bottom-1 left-1 bg-[#16834B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Main Photo
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setMainImage(idx)}
                  className="absolute bottom-1 left-1 bg-black/70 hover:bg-[#16834B] text-white text-[10px] font-semibold px-2 py-0.5 rounded transition cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  Set as Main
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
