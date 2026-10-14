import sharp from 'sharp';

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export class ImageCompressionService {
  /**
   * Mengompresi buffer gambar dan mengonversinya ke format WebP
   */
  async compressToWebP(
    input: Buffer | Uint8Array | ArrayBuffer,
    options: CompressionOptions = {}
  ): Promise<Buffer> {
    const { maxWidth = 1200, maxHeight = 1200, quality = 80 } = options;

    const buffer = Buffer.isBuffer(input)
      ? input
      : input instanceof Uint8Array
      ? Buffer.from(input.buffer, input.byteOffset, input.byteLength)
      : Buffer.from(input);

    return sharp(buffer)
      .rotate() // Otomatis menyesuaikan orientasi EXIF kamera HP
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 4 })
      .toBuffer();
  }
}

export const imageCompressionService = new ImageCompressionService();
