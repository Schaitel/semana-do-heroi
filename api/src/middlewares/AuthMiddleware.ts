import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
  sub: string;
}

class AuthMiddleware {
  auth(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader)
      return response
        .status(401)
        .json({ code: 'token.missing', message: 'Token missing' });

    const [, token] = authHeader.split(' ');

    const secretKey: string | undefined = process.env.JWT_SECRET;

    if (!secretKey) throw new Error('Secret key not found');

    try {
      const { sub } = verify(token, secretKey) as IPayload;

      request.user_id = sub;

      return next();
    } catch (error) {
      return response
        .status(401)
        .json({ code: 'token.expired', message: 'Token expired' });
    }
  }
}

export { AuthMiddleware };
