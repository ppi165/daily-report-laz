import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/src/infrastructure/auth';
import { updateUserUseCase } from '@/src/modules/users/use-cases/update-user.use-case';
import { UpdateUserSchema } from '@/src/modules/users/schemas/update-user.schema';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await request.json();

    const validated = UpdateUserSchema.parse({
      ...body,
      targetUserId: resolvedParams.id,
    });

    const result = await updateUserUseCase.execute(validated, payload.userId as string);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = message.includes('Unauthorized')
      ? 401
      : message.includes('Pelanggaran hak akses') || message.includes('berwenang')
      ? 403
      : message.includes('sudah dipakai') || message.includes('sudah terdaftar')
      ? 409
      : message.includes('tidak ditemukan')
      ? 404
      : 400;

    return NextResponse.json({ success: false, message }, { status });
  }
}
