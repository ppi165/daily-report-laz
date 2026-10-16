import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/src/infrastructure/auth';
import { resetPasswordUseCase } from '@/src/modules/users/use-cases/reset-password.use-case';
import { ResetPasswordSchema } from '@/src/modules/users/schemas/reset-password.schema';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Sesi tidak ditemukan' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Sesi tidak valid' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = ResetPasswordSchema.parse(body);

    const result = await resetPasswordUseCase.execute(validated, payload.userId as string);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan pada server';
    const status = message.includes('Unauthorized')
      ? 401
      : message.includes('Pelanggaran hak akses') || message.includes('tidak berwenang')
      ? 403
      : message.includes('tidak ditemukan')
      ? 404
      : 400;

    return NextResponse.json({ success: false, message }, { status });
  }
}
