import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserUseCase } from '@/src/modules/users/use-cases/get-current-user.use-case';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    const user = await getCurrentUserUseCase.execute(token);
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('tidak ditemukan') ? 404 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
