import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }

  // 检查文件大小 (1MB = 1024 * 1024 bytes)
  const maxSize = 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File size must be less than 1MB' }, { status: 400 });
  }

  const blob = await put(file.name, file, { access: 'public', addRandomSuffix: true });
  return NextResponse.json({ url: blob.url });
} 