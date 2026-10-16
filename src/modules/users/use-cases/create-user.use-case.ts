import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { CreateUserInput, CreateUserSchema } from '../schemas/create-user.schema';

export class CreateUserUseCase {
  async execute(input: CreateUserInput, actorId: string) {
    const validated = CreateUserSchema.parse(input);

    if (!actorId) {
      throw new Error('Unauthorized: Sesi tidak ditemukan.');
    }

    const actor = await userRepository.findById(actorId);
    if (!actor) {
      throw new Error('Akun pembuat tidak ditemukan.');
    }

    if (actor.role !== 'SUPERADMIN' && actor.role !== 'ADMIN') {
      throw new Error('Hanya Superadmin dan Admin (Pimpinan) yang berwenang menambahkan amil baru.');
    }

    // Cek duplikasi username atau email
    const existing = await userRepository.findByUsernameOrEmail(validated.username, validated.email);
    if (existing) {
      if (existing.username.toLowerCase() === validated.username.toLowerCase()) {
        throw new Error(`Username '${validated.username}' sudah digunakan oleh amil lain.`);
      }
      if (existing.email.toLowerCase() === validated.email.toLowerCase()) {
        throw new Error(`Email '${validated.email}' sudah terdaftar dalam sistem.`);
      }
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const newUser = await userRepository.createUser({
      name: validated.name.trim(),
      username: validated.username.toLowerCase().trim(),
      email: validated.email.toLowerCase().trim(),
      division: validated.division,
      position: validated.position || 'Staf Pelaksana',
      role: validated.role,
      password: hashedPassword,
    });

    return {
      success: true,
      message: `Akun amil baru '${newUser.name}' berhasil dibuat dengan role ${newUser.role}.`,
      data: newUser,
    };
  }
}

export const createUserUseCase = new CreateUserUseCase();
