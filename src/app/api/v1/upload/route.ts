import { NextRequest, NextResponse } from 'next/server';
import { imageCompressionService, storageService } from '@/src/infrastructure/storage';
import { verifyJWT } from '@/src/infrastructure/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Sesi tidak valid atau telah kedaluwarsa.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'attachments';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Berkas tidak ditemukan.' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Hanya berkas gambar (JPG, PNG, WEBP, dll) yang diizinkan.' },
        { status: 400 }
      );
    }

    // 1. Baca buffer gambar asli
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 2. Kompresi gambar dan konversi ke format WebP via Sharp
    const webpBuffer = await imageCompressionService.compressToWebP(inputBuffer, {
      maxWidth: 1280,
      maxHeight: 1280,
      quality: 80,
    });

    // 3. Simpan buffer WebP ke Supabase Storage
    const publicUrl = await storageService.uploadWebPBuffer(webpBuffer, file.name, folder);

    const originalSize = file.size;
    const compressedSize = webpBuffer.length;
    const savedPercentage = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      format: 'webp',
      originalSize,
      compressedSize,
      savedPercentage: savedPercentage > 0 ? `${savedPercentage}%` : '0%',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Terjadi kesalahan saat mengompresi gambar.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
