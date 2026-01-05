/**
 * CV service - Business logic for CV operations
 */

import { ICV } from '../models/CV';
import { CVRepository } from '../repositories/cv.repository';
import { PaginationParams, PaginatedResponse } from '../types';

const cvRepository = new CVRepository();

/**
 * CV service class
 */
export class CVService {
  /**
   * Get CVs for user with pagination
   * @param userId - User ID
   * @param params - Pagination parameters
   * @returns Paginated CVs
   */
  async getCVs(userId: string, params: PaginationParams): Promise<PaginatedResponse<ICV>> {
    return cvRepository.findByUserId(userId, params);
  }

  /**
   * Get CV by ID
   * @param cvId - CV ID
   * @param userId - User ID
   * @returns CV document
   */
  async getCVById(cvId: string, userId: string): Promise<ICV> {
    const cv = await cvRepository.findById(cvId, userId);
    if (!cv) {
      throw new Error('CV not found');
    }
    return cv;
  }

  /**
   * Create a new CV
   * @param userId - User ID
   * @param cvData - CV data
   * @returns Created CV document
   */
  async createCV(userId: string, cvData: Partial<ICV>): Promise<ICV> {
    return cvRepository.create({
      ...cvData,
      userId: userId as unknown as ICV['userId'],
    });
  }

  /**
   * Update CV
   * @param cvId - CV ID
   * @param userId - User ID
   * @param updateData - Update data
   * @returns Updated CV document
   */
  async updateCV(cvId: string, userId: string, updateData: Partial<ICV>): Promise<ICV> {
    return cvRepository.updateById(cvId, userId, updateData);
  }

  /**
   * Autosave CV
   * @param cvId - CV ID
   * @param userId - User ID
   * @param data - Partial CV data
   * @returns Updated CV document
   */
  async autosaveCV(cvId: string, userId: string, data: Partial<ICV['data']>): Promise<ICV> {
    return cvRepository.autosave(cvId, userId, data);
  }

  /**
   * Delete CV
   * @param cvId - CV ID
   * @param userId - User ID
   * @returns Deleted CV document
   */
  async deleteCV(cvId: string, userId: string): Promise<ICV> {
    return cvRepository.deleteById(cvId, userId);
  }

  /**
   * Duplicate CV
   * @param cvId - CV ID
   * @param userId - User ID
   * @returns Duplicated CV document
   */
  async duplicateCV(cvId: string, userId: string): Promise<ICV> {
    return cvRepository.duplicate(cvId, userId);
  }
}

