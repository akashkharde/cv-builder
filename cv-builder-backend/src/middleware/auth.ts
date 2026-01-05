/**
 * Authentication middleware
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthenticationError } from '../utils/errors';
import { AuthRequest } from '../types';

/**
 * Authenticate user via JWT token
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.accessToken as string | undefined;
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const decoded = verifyToken(token);

    (req as AuthRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch {
    next(new AuthenticationError('Invalid or expired token'));
  }
};

