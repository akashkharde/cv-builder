/**
 * User repository - Data access layer for User model
 */

import { IUser, User } from '../models/User';
import { NotFoundError } from '../utils/errors';

/**
 * User repository class
 */
export class UserRepository {
  /**
   * Find user by email
   * @param email - User email
   * @param includePassword - Whether to include password hash
   * @returns User document or null
   */
  async findByEmail(email: string, includePassword: boolean = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      return query.select('+passwordHash').exec();
    }
    return query.exec();
  }

  /**
   * Find user by username
   * @param username - Username
   * @returns User document or null
   */
  async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username }).exec();
  }

  /**
   * Find user by ID
   * @param userId - User ID
   * @returns User document or null
   */
  async findById(userId: string): Promise<IUser | null> {
    return User.findById(userId).exec();
  }

  /**
   * Find user by OAuth provider ID
   * @param provider - OAuth provider name
   * @param providerId - Provider user ID
   * @returns User document or null
   */
  async findByOAuthProvider(provider: 'google' | 'facebook', providerId: string): Promise<IUser | null> {
    return User.findOne({
      'oauthProviders.provider': provider,
      'oauthProviders.providerId': providerId,
    }).exec();
  }

  /**
   * Create a new user
   * @param userData - User data
   * @returns Created user document
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  /**
   * Update user by ID
   * @param userId - User ID
   * @param updateData - Update data
   * @returns Updated user document
   */
  async updateById(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  /**
   * Add refresh token to user
   * @param userId - User ID
   * @param tokenHash - Hashed refresh token
   * @returns Updated user document
   */
  async addRefreshToken(userId: string, tokenHash: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          refreshTokens: {
            tokenHash,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  /**
   * Revoke refresh token
   * @param userId - User ID
   * @param tokenHash - Hashed refresh token
   * @returns Updated user document
   */
  async revokeRefreshToken(userId: string, tokenHash: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'refreshTokens.$[token].revokedAt': new Date(),
        },
      },
      {
        arrayFilters: [{ 'token.tokenHash': tokenHash }],
        new: true,
      }
    ).exec();

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  /**
   * Check if email exists
   * @param email - Email address
   * @returns True if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email: email.toLowerCase() }).exec();
    return count > 0;
  }

  /**
   * Check if username exists
   * @param username - Username
   * @returns True if username exists
   */
  async usernameExists(username: string): Promise<boolean> {
    const count = await User.countDocuments({ username }).exec();
    return count > 0;
  }
}

