/**
 * Authentication service - Business logic for authentication
 */

import { IUser } from '../models/User';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { ConflictError, AuthenticationError } from '../utils/errors';
import { JWTPayload } from '../types';
import crypto from 'crypto';

const userRepository = new UserRepository();

/**
 * Authentication service class
 */
export class AuthService {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns User and tokens
   */
  async register(userData: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    // Check if email already exists
    if (await userRepository.emailExists(userData.email)) {
      throw new ConflictError('Email already registered');
    }

    // Check if username already exists
    if (await userRepository.usernameExists(userData.username)) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user
    const user = await userRepository.create({
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      passwordHash,
      isVerified: false,
    });

    // Generate tokens
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token hash
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await userRepository.addRefreshToken(user._id.toString(), refreshTokenHash);

    // Remove password from user object
    const userObj = user.toObject();
    delete userObj.passwordHash;

    return {
      user: userObj as IUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   * @param identifier - Email or username
   * @param password - Password
   * @returns User and tokens
   */
  async login(identifier: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    // Find user by email or username
    let user = await userRepository.findByEmail(identifier, true);
    
    if (!user) {
      user = await userRepository.findByUsername(identifier);
      if (user) {
        // Need password for verification
        const userWithPassword = await userRepository.findByEmail(user.email, true);
        if (userWithPassword) {
          user = userWithPassword;
        }
      }
    }

    if (!user || !user.passwordHash) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate tokens
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token hash
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await userRepository.addRefreshToken(user._id.toString(), refreshTokenHash);

    // Remove password from user object
    const userObj = user.toObject();
    delete userObj.passwordHash;

    return {
      user: userObj as IUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   * @param refreshToken - Refresh token
   * @returns New access token and refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken) as JWTPayload;

      // Find user
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Check if refresh token is in user's refresh tokens list
      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const tokenExists = user.refreshTokens.some(
        (token) => token.tokenHash === refreshTokenHash && !token.revokedAt
      );

      if (!tokenExists) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new tokens
      const payload: JWTPayload = {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      // Revoke old token and add new one
      await userRepository.revokeRefreshToken(user._id.toString(), refreshTokenHash);
      const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
      await userRepository.addRefreshToken(user._id.toString(), newRefreshTokenHash);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  /**
   * Logout user
   * @param userId - User ID
   * @param refreshToken - Refresh token to revoke
   */
  async logout(userId: string, refreshToken: string): Promise<void> {
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await userRepository.revokeRefreshToken(userId, refreshTokenHash);
  }
}

