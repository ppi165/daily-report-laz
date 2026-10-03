import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '../services/DashboardService';
import { verifyJWT } from '../../../shared/utils/jwt';

const dashboardService = new DashboardService();

export class DashboardController {
  async getStats(request: NextRequest) {
    try {
      const token = request.cookies.get('token')?.value;
      if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      
      const user = await verifyJWT(token);
      if (!user) return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });

      const result = await dashboardService.getDashboardStats();
      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
  }
}
