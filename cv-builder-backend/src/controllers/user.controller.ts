/**
 * User controller - Request handlers for user operations
 */

import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest, ApiResponse } from '../types';
import { HTTP_STATUS } from '../utils/constants';

const userService = new UserService();

/**
 * Get current user profile
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.getProfile(req.user!.userId);

    const response: ApiResponse = {
      statusCode: HTTP_STATUS.OK,
      success: true,
      data: { user },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.updateProfile(req.user!.userId, req.body);

    const response: ApiResponse = {
      statusCode: HTTP_STATUS.OK,

      success: true,
      data: { user },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get presigned URL for avatar upload (placeholder)
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const getAvatarPresignUrl = async (
  _req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Placeholder - will implement S3 presigned URL later
    const response: ApiResponse = {
      statusCode: HTTP_STATUS.NOT_FOUND,
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Avatar presigned URL not yet implemented',
      },
    };

    res.status(HTTP_STATUS.NOT_FOUND).json(response);
  } catch (error) {
    next(error);
  }
};

