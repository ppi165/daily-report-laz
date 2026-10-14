import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/src/infrastructure/auth';
import { createReportUseCase } from '@/src/modules/reports/use-cases/create-report.use-case';
import { getReportsUseCase } from '@/src/modules/reports/use-cases/get-reports.use-case';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get('division') || undefined;

    const reports = await getReportsUseCase.execute({ division });
    return NextResponse.json({ success: true, data: reports }, { status: 200 });
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
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });
    }

    const body = await request.json();
    const report = await createReportUseCase.execute(body, decoded.userId as string);

    return NextResponse.json(
      { success: true, message: 'Laporan berhasil disimpan', data: report },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Gagal menyimpan laporan',
      },
      { status: 400 }
    );
  }
}
