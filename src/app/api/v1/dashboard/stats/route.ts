import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/src/infrastructure/auth';
import { getDashboardStatsUseCase } from '@/src/modules/dashboard/use-cases/get-dashboard-stats.use-case';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });
    }

    const data = await getDashboardStatsUseCase.execute();
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
