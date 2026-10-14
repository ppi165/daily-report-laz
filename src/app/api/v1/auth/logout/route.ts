import { NextResponse } from 'next/server';
import { logoutAction } from '@/src/modules/auth/actions/logout.action';

export async function POST() {
  const result = await logoutAction();
  return NextResponse.json(result, { status: 200 });
}
