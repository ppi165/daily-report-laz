import bcrypt from 'bcryptjs';
import { authRepository } from '../repositories/auth.repository';
import { LoginInput } from '../schemas/login.schema';
import { signJWT } from '@/src/infrastructure/auth';

export class LoginUseCase {
  async execute(input: LoginInput) {
    const user = await authRepository.findUserByIdentifier(input.identifier);

    if (!user) {
      throw new Error('Akun tidak ditemukan');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Password salah');
    }

    const expiresIn = input.remember ? '30d' : '1d';

    const token = await signJWT(
      {
        userId: user.id,
        username: user.username,
        name: user.name,
        division: user.division,
      },
      expiresIn
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expiresIn,
    };
  }
}

export const loginUseCase = new LoginUseCase();
