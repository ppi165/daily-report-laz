import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/src/infrastructure/auth';
import { getAllUsersUseCase } from '@/src/modules/users/use-cases/get-all-users.use-case';
import { createUserUseCase } from '@/src/modules/users/use-cases/create-user.use-case';
import { CreateUserSchema } from '@/src/modules/users/schemas/create-user.schema';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const division = searchParams.get('division') || undefined;
    const role = searchParams.get('role') || undefined;
    const search = searchParams.get('search') || undefined;

    const data = await getAllUsersUseCase.execute({ division, role, search });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = CreateUserSchema.parse(body);

    const result = await createUserUseCase.execute(validated, payload.userId as string);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = message.includes('Unauthorized')
      ? 401
      : message.includes('berwenang')
      ? 403
      : message.includes('sudah digunakan') || message.includes('sudah terdaftar')
      ? 409
      : 400;

    return NextResponse.json({ success: false, message }, { status });
  }
}
