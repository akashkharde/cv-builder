/**
 * CV repository - Data access layer for CV model
 */

import { ICV, CV } from '../models/CV';
import { NotFoundError } from '../utils/errors';
import { PaginationParams, PaginatedResponse } from '../types';
import { DEFAULT_PAGINATION } from '../utils/constants';

/**
 * CV repository class
 */
export class CVRepository {
  /**
   * Find CV by ID
   * @param cvId - CV ID
   * @param userId - User ID (optional, for ownership check)
   * @returns CV document or null
   */
  async findById(cvId: string, userId?: string): Promise<ICV | null> {
    const query: { _id: string; isDeleted: boolean; userId?: string } = {
      _id: cvId,
      isDeleted: false,
    };

    if (userId) {
      query.userId = userId;
    }

    return CV.findOne(query).populate('layoutId').exec();
  }

  /**
   * Find CVs by user ID with pagination
   * @param userId - User ID
   * @param params - Pagination parameters
   * @returns Paginated CVs
   */
  async findByUserId(
    userId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<ICV>> {
    const limit = Math.min(params.limit || DEFAULT_PAGINATION.LIMIT, DEFAULT_PAGINATION.MAX_LIMIT);

    const query: { userId: string; isDeleted: boolean; _id?: { $lt: string } } = {
      userId,
      isDeleted: false,
    };

    if (params.cursor) {
      query._id = { $lt: params.cursor };
    }

    const cvs = await CV.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .select('-data') // Exclude full data for list view
      .populate('layoutId', 'name')
      .exec();

    const hasMore = cvs.length > limit;
    const data = hasMore ? cvs.slice(0, limit) : cvs;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1]._id.toString() : undefined;

    return {
      data,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Create a new CV
   * @param cvData - CV data
   * @returns Created CV document
   */
  async create(cvData: Partial<ICV>): Promise<ICV> {
    const cv = new CV(cvData);
    const savedCV = await cv.save();
    return this.findById(savedCV._id.toString()) as Promise<ICV>;
  }

  /**
   * Update CV by ID
   * @param cvId - CV ID
   * @param userId - User ID
   * @param updateData - Update data
   * @returns Updated CV document
   */
  async updateById(cvId: string, userId: string, updateData: Partial<ICV>): Promise<ICV> {
    // Get current CV to increment version
    const currentCV = await CV.findOne({ _id: cvId, userId, isDeleted: false }).exec();
    if (!currentCV) {
      throw new NotFoundError('CV');
    }

    const cv = await CV.findOneAndUpdate(
      { _id: cvId, userId, isDeleted: false },
      {
        $set: {
          ...updateData,
          lastSavedAt: new Date(),
          version: (currentCV.version || 1) + 1,
        },
      },
      { new: true, runValidators: true }
    ).populate('layoutId').exec();

    if (!cv) {
      throw new NotFoundError('CV');
    }

    return cv;
  }

  /**
   * Autosave CV (partial update)
   * @param cvId - CV ID
   * @param userId - User ID
   * @param data - Partial CV data
   * @returns Updated CV document
   */
  async autosave(cvId: string, userId: string, data: Partial<ICV['data']>): Promise<ICV> {
    const cv = await CV.findOneAndUpdate(
      { _id: cvId, userId, isDeleted: false },
      {
        $set: {
          'data': data,
          lastSavedAt: new Date(),
        },
      },
      { new: true }
    ).populate('layoutId').exec();

    if (!cv) {
      throw new NotFoundError('CV');
    }

    return cv;
  }

  /**
   * Soft delete CV
   * @param cvId - CV ID
   * @param userId - User ID
   * @returns Deleted CV document
   */
  async deleteById(cvId: string, userId: string): Promise<ICV> {
    const cv = await CV.findOneAndUpdate(
      { _id: cvId, userId, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    ).populate('layoutId').exec();

    if (!cv) {
      throw new NotFoundError('CV');
    }

    return cv;
  }

  /**
   * Duplicate CV
   * @param cvId - CV ID
   * @param userId - User ID
   * @returns Duplicated CV document
   */
  async duplicate(cvId: string, userId: string): Promise<ICV> {
    const originalCV = await CV.findOne({ _id: cvId, userId, isDeleted: false }).exec();

    if (!originalCV) {
      throw new NotFoundError('CV');
    }

    const cvData = originalCV.toObject();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (cvData as any)._id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (cvData as any).createdAt;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (cvData as any).updatedAt;
    cvData.title = `${cvData.title} (Copy)`;
    cvData.version = 1;

    const newCV = new CV(cvData);
    const savedCV = await newCV.save();
    return this.findById(savedCV._id.toString()) as Promise<ICV>;
  }
}

