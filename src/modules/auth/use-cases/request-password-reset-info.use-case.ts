import { authRepository } from '../repositories/auth.repository';
import { ForgotPasswordInput } from '../schemas/forgot-password.schema';

export class RequestPasswordResetInfoUseCase {
  async execute(input: ForgotPasswordInput) {
    const user = await authRepository.findUserByIdentifier(input.identifier);

    if (!user) {
      throw new Error('Akun dengan username atau email tersebut tidak ditemukan di sistem.');
    }

    return {
      id: user.id,
      name: user.name,
      division: user.division,
      username: user.username,
      email: user.email,
    };
  }
}

export const requestPasswordResetInfoUseCase = new RequestPasswordResetInfoUseCase();
