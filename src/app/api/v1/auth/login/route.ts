import { NextRequest, NextResponse } from 'next/server';
import { loginAction } from '@/src/modules/auth/actions/login.action';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await loginAction(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Terjadi kesalahan pada server',
      },
      { status: 500 }
    );
  }
}
