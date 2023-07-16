import { prisma } from '../database/prisma';
import { ICreate } from '../interfaces/UsersInterface';

class UsersRepository {
  async create({ name, email, password }: ICreate) {
    return prisma.users.create({
      data: {
        name,
        email,
        password,
      },
    });
  }
  async findUsersByEmail(email: string) {
    return prisma.users.findUnique({
      where: {
        email,
      },
    });
  }
  async findUsersById(id: string) {
    return prisma.users.findUnique({
      where: {
        id,
      },
    });
  }
  async update(name: string, avatarUrl: string, user_id: string) {
    return prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        name,
        avatar_url: avatarUrl,
      },
    });
  }
  async updatePassword(user_id: string, newPassword: string) {
    return prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        password: newPassword,
      },
    });
  }
}

export { UsersRepository };
