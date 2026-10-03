import { NextRequest } from 'next/server';
import { DashboardController } from '@/src/modules/dashboard/controllers/DashboardController';

const dashboardController = new DashboardController();

export async function GET(request: NextRequest) {
  return dashboardController.getStats(request);
}
