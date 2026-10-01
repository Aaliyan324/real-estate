import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getStorageDriver } from '@/lib/storage'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'AGENT')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const storage = getStorageDriver()
    const savedUrls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum allowed size of 5MB` },
          { status: 400 },
        )
      }

      const { url } = await storage.upload(file)
      savedUrls.push(url)
    }

    return NextResponse.json({ success: true, urls: savedUrls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 })
  }
}
