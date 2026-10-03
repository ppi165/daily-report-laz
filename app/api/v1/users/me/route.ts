import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/src/shared/utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    const decoded = await verifyJWT(token);
    if (!decoded) return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId as string },
      select: { id: true, name: true, email: true, username: true, division: true }
    });

    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
