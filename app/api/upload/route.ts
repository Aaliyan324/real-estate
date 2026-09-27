import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getSession } from '@/lib/auth'

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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'properties')
    await mkdir(uploadDir, { recursive: true })

    const savedUrls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue
      }

      // Max size: 5MB
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: `File ${file.name} exceeds maximum allowed size of 5MB` }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const ext = path.extname(file.name) || '.jpg'
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${sanitizedName}${ext}`
      const filePath = path.join(uploadDir, fileName)

      await writeFile(filePath, buffer)
      savedUrls.push(`/uploads/properties/${fileName}`)
    }

    return NextResponse.json({ success: true, urls: savedUrls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 })
  }
}
