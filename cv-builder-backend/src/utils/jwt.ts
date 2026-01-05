/**
 * JWT token utilities
 */

import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
const JWT_ACCESS_EXPIRY: string = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY: string = process.env.JWT_REFRESH_EXPIRY || '30d';

/**
 * Generate access token
 * @param payload - JWT payload
 * @returns Access token string
 */
export const generateAccessToken = (payload: JWTPayload): string => {
  const { userId, email, username } = payload;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = { expiresIn: JWT_ACCESS_EXPIRY };
  return jwt.sign({ userId, email, username }, JWT_SECRET, options);
};

/**
 * Generate refresh token
 * @param payload - JWT payload
 * @returns Refresh token string
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
  const { userId, email, username } = payload;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = { expiresIn: JWT_REFRESH_EXPIRY };
  return jwt.sign({ userId, email, username }, JWT_SECRET, options);
};

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded payload
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

