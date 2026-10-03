import { NextRequest } from 'next/server';
import { AuthController } from '@/src/modules/auth/controllers/AuthController';

const authController = new AuthController();

export async function POST(request: NextRequest) {
  return authController.login(request);
}
