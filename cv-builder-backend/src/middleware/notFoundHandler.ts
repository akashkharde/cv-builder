/**
 * 404 Not Found handler middleware
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { HTTP_STATUS, ERROR_CODES } from '../utils/constants';

/**
 * Handle 404 Not Found errors
 * @param req - Express request
 * @param res - Express response
 */
export const notFoundHandler = (req: Request, res: Response<ApiResponse>): void => {
  const response: ApiResponse = {
    statusCode: HTTP_STATUS.NOT_FOUND,
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
    },
  };

  res.status(HTTP_STATUS.NOT_FOUND).json(response);
};

