/**
 * User service - Business logic for user operations
 */

import { IUser } from '../models/User';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundError } from '../utils/errors';

const userRepository = new UserRepository();

/**
 * User service class
 */
export class UserService {
  /**
   * Get user profile by ID
   * @param userId - User ID
   * @returns User document
   */
  async getProfile(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param updateData - Update data
   * @returns Updated user document
   */
  async updateProfile(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    // If password is being updated, hash it
    if (updateData.passwordHash) {
      // This should be the plain password, not hash
      // But for now, we'll handle it in the controller
    }

    return userRepository.updateById(userId, updateData);
  }

  /**
   * Update user avatar URL
   * @param userId - User ID
   * @param avatarUrl - Avatar URL
   * @returns Updated user document
   */
  async updateAvatar(userId: string, avatarUrl: string): Promise<IUser> {
    return userRepository.updateById(userId, { avatarUrl });
  }
}

