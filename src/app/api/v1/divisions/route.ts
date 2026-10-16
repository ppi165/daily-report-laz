import { NextRequest, NextResponse } from 'next/server';
import { getDivisionsUseCase } from '@/src/modules/divisions/use-cases/get-divisions.use-case';
import { createDivisionUseCase } from '@/src/modules/divisions/use-cases/create-division.use-case';

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
