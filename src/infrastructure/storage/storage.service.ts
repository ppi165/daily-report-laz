import { supabase } from '@/src/infrastructure/supabase/client';

export class StorageService {
  private readonly bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'daily-reports';
  private bucketChecked = false;

  private async ensureBucketExists() {
    if (this.bucketChecked) return;
    try {
      await supabase.storage.createBucket(this.bucketName, { public: true });
    } catch {
      // Abaikan jika bucket sudah ada
    } finally {
      this.bucketChecked = true;
    }
  }

  /**
   * Mengunggah berkas foto dari client ke route API /api/v1/upload
   */
  async uploadReportImage(file: File): Promise<string> {
    if (!file) {
      throw new Error('Berkas gambar tidak ditemukan.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Berkas harus berupa gambar (JPEG, PNG, WEBP, dll).');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Ukuran berkas asli maksimal 10MB.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/v1/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || result.message || 'Gagal mengunggah dan mengompresi gambar.');
    }

    return result.url;
  }

  /**
   * Mengunggah buffer WebP langsung ke Supabase Storage (digunakan di Server)
   */
  async uploadWebPBuffer(
    buffer: Buffer,
    originalName: string,
    folder: string = 'attachments'
  ): Promise<string> {
    await this.ensureBucketExists();

    const baseName = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${Date.now()}-${baseName}.webp`;

    const { error: uploadError } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, buffer, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 tahun cache
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah foto WebP ke Supabase Storage: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(this.bucketName).getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error('Gagal memperoleh Public URL dari Supabase Storage.');
    }

    return data.publicUrl;
  }

  /**
   * Menghapus berkas foto dari Supabase Storage
   */
  async deleteImage(pathOrUrl: string): Promise<boolean> {
    try {
      if (!pathOrUrl) return false;

      let path = pathOrUrl;
      const bucketMarker = `${this.bucketName}/`;
      if (pathOrUrl.includes(bucketMarker)) {
        path = pathOrUrl.split(bucketMarker)[1];
      }

      const { error } = await supabase.storage.from(this.bucketName).remove([path]);
      return !error;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
