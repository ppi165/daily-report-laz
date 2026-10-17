import { NextRequest, NextResponse } from 'next/server';
import { getDivisionsUseCase } from '@/src/modules/divisions/use-cases/get-divisions.use-case';
import { createDivisionUseCase } from '@/src/modules/divisions/use-cases/create-division.use-case';
import { verifyJWT } from '@/src/infrastructure/auth';

export async function GET() {
  try {
    const data = await getDivisionsUseCase.execute();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Sesi tidak ditemukan.' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Sesi tidak valid.' },
        { status: 401 }
      );
    }

    if (payload.role !== 'SUPERADMIN' && payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Hanya Administrator yang diizinkan mengelola divisi.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = await createDivisionUseCase.execute(body);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Gagal membuat divisi',
      },
      { status: 400 }
    );
  }
}
