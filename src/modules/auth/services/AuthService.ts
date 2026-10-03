import bcrypt from 'bcryptjs';
import { AuthRepository } from '../repositories/AuthRepository';
import { signJWT } from '../../../shared/utils/jwt';

const authRepository = new AuthRepository();

export class AuthService {
  async login(identifier: string, password: string, remember: boolean = false) {
    if (!identifier || !password) {
      return { success: false, message: 'Email/Username dan Password wajib diisi' };
    }

    const user = await authRepository.findUserByUsernameOrEmail(identifier);
    
    if (!user) {
      return { success: false, message: 'Akun tidak ditemukan' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, message: 'Password salah' };
    }

    // Expiration logic based on "remember me"
    const expiresIn = remember ? '30d' : '1d';
    
    const token = await signJWT({
      userId: user.id,
      username: user.username,
      name: user.name,
      division: user.division
    }, expiresIn);

    // Hilangkan field password sebelum mereturn data user
    const { password: _, ...userWithoutPassword } = user;

    return { 
      success: true, 
      message: 'Login berhasil', 
      data: { user: userWithoutPassword, token, expiresIn } 
    };
  }
}
