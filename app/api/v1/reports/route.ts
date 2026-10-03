import { NextRequest } from 'next/server';
import { ReportController } from '@/src/modules/reports/controllers/ReportController';

const reportController = new ReportController();

export async function GET(request: NextRequest) {
  return reportController.getAllReports(request);
}

export async function POST(request: NextRequest) {
  return reportController.createReport(request);
}
