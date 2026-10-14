import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const secretKey = process.env.JWT_SECRET || 'laz-persis-default-secret-key-2026-safe-fallback';
const key = new TextEncoder().encode(secretKey);

export async function signJWT(payload: JWTPayload, expiresIn: string = '1d'): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}
