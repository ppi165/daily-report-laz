import { NextRequest, NextResponse } from 'next/server';
import { ReportService } from '../services/ReportService';
import { verifyJWT } from '../../../shared/utils/jwt';

const reportService = new ReportService();

export class ReportController {
  async createReport(request: NextRequest) {
    try {
      const token = request.cookies.get('token')?.value;
      if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      
      const user = await verifyJWT(token);
      if (!user) return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });

      const body = await request.json();
      const { title, content, division, attachments } = body;

      const result = await reportService.createReport({
        title,
        content,
        division,
        attachments,
        authorId: user.userId as string
      });

      if (!result.success) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: result.message, data: result.data }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
  }

  async getAllReports(request: NextRequest) {
    try {
      const token = request.cookies.get('token')?.value;
      if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      
      const user = await verifyJWT(token);
      if (!user) return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });

      const result = await reportService.getAllReports();
      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
  }
}
