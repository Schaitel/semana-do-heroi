import { compare, hash } from 'bcrypt';
import { ICreate, IUpdate } from '../interfaces/UsersInterface';
import { UsersRepository } from '../repositories/UserRepository';
import { s3 } from '../config/aws';
import { v4 as uuid } from 'uuid';
import { sign, verify } from 'jsonwebtoken';

class UsersServices {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async create({ name, email, password }: ICreate) {
    const findUser = await this.usersRepository.findUsersByEmail(email);

    if (findUser) throw new Error('User already exists');

    const hashPassword = await hash(password, 10);

    return this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });
  }

  async auth(email: string, password: string) {
    const findUser = await this.usersRepository.findUsersByEmail(email);

    if (!findUser) throw new Error('User or password invalid');

    const passwordMatch = await compare(password, findUser.password);

    if (!passwordMatch) throw new Error('User or password invalid');

    const secretKey: string | undefined = process.env.JWT_SECRET;

    if (!secretKey) throw new Error('Secret key not found');

    const token = sign({ email }, secretKey, {
      subject: findUser.id,
      expiresIn: 60 * 15,
    });

    const refreshToken = sign({ email }, secretKey, {
      subject: findUser.id,
      expiresIn: '7d',
    });

    return {
      token,
      refreshToken,
      user: {
        name: findUser.name,
        email: findUser.email,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new Error('Refresh token is required');

    const secretKey: string | undefined = process.env.JWT_SECRET;

    if (!secretKey) throw new Error('Secret key not found');

    const verifyRefreshToken = verify(refreshToken, secretKey);

    const { sub } = verifyRefreshToken;

    const newToken = sign({ sub }, secretKey, {
      expiresIn: 60 * 15,
    });

    return { token: newToken };
  }

  async update({
    name,
    oldPassword,
    newPassword,
    avatarUrl,
    user_id,
  }: IUpdate) {
    if (oldPassword && newPassword) {
      const findUserById = await this.usersRepository.findUsersById(user_id);

      if (!findUserById) throw new Error('User not found');

      const passwordMatch = await compare(oldPassword, findUserById.password);

      if (!passwordMatch) throw new Error('Password does not match');

      const password = await hash(newPassword, 10);

      await this.usersRepository.updatePassword(user_id, password);
    }

    if (avatarUrl) {
      const uploadS3 = await s3
        .upload({
          Bucket: 'semana-heroi-schaitel',
          Key: `${uuid()}-${avatarUrl?.originalname}}`,
          Body: avatarUrl?.buffer,
        })
        .promise();

      await this.usersRepository.update(name, uploadS3.Location, user_id);
    }

    return {
      message: 'User updated successfully',
    };
  }
}

export { UsersServices };
