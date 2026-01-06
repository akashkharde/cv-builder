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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = verifyToken(token);

    // Attach user info to request
    (req as AuthRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof Error && error.message.includes('token')) {
      next(new AuthenticationError('Invalid or expired token'));
    } else {
      next(error);
    }
  }
};

