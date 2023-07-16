import { NextFunction, Request, Response } from 'express';
import { UsersServices } from '../services/UserServices';

class UsersController {
  private usersService: UsersServices;

  constructor() {
    this.usersService = new UsersServices();
  }

  index() {
    // buscar todos
  }

  show() {
    // buscar um
  }

  async store(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;

    try {
      const result = await this.usersService.create({ name, email, password });

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;

      const result = await this.usersService.auth(email, password);

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(request: Request, response: Response, next: NextFunction) {
    try {
      const { refreshToken } = request.body;

      const result = await this.usersService.refreshToken(refreshToken);

      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, oldPassword, newPassword } = request.body;
    const { user_id } = request;

    try {
      const result = await this.usersService.update({
        name,
        oldPassword,
        newPassword,
        avatarUrl: request.file,
        user_id,
      });

      return response.status(200).json(result);
    } catch (error) {
      console.log('error', error);
      next(error);
    }
  }
}

export { UsersController };
