import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const DEFAULT_SECRET = 'super-secret-key-laz-persis-2026';

const fallbackSecrets = [
  'super-secret-key-laz-persis-2026',
  '3ac4a536c078967e7702a96af702b8d798f41dd8d0c24f024635d020de06899e',
  'laz-persis-default-secret-key-2026-safe-fallback',
];

export async function signJWT(payload: JWTPayload, expiresIn: string = '1d'): Promise<string> {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  const key = new TextEncoder().encode(secret);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  const activeSecret = process.env.JWT_SECRET || DEFAULT_SECRET;
  const activeKey = new TextEncoder().encode(activeSecret);

  // 1. Verifikasi dengan secret aktif saat ini
  try {
    const { payload } = await jwtVerify(token, activeKey);
    return payload;
  } catch {
    // 2. Jika gagal (misal pergantian secret .env saat user masih login), verifikasi via fallback
    for (const fb of fallbackSecrets) {
      if (fb !== activeSecret) {
        try {
          const { payload } = await jwtVerify(token, new TextEncoder().encode(fb));
          return payload;
        } catch {
          // lanjut cek key berikutnya
        }
      }
    }
    return null;
  }
}

