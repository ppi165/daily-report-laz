import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'laz-persis-default-secret-key-2026-safe-fallback';
const key = new TextEncoder().encode(secretKey);

export async function signJWT(payload: any, expiresIn: string = '1d') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}
