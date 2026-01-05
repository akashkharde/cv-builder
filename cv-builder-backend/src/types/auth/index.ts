/**
 * Authentication related types
 */

import { JwtPayload } from 'jsonwebtoken';

/**
 * JWT Payload interface
 */
export interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
  username: string;
}

/**
 * OAuth Provider types
 */
export type OAuthProvider = 'google' | 'facebook';

/**
 * Registration request data
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  captchaToken?: string;
}

/**
 * Login request data
 */
export interface LoginRequest {
  identifier: string; // email or username
  password: string;
}

/**
 * Auth response data
 */
export interface AuthResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    phone?: string;
    isVerified: boolean;
    avatarUrl?: string;
  };
  accessToken: string;
}

