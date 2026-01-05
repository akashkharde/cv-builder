import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ApiResponse } from '../types';
import { HTTP_STATUS } from '../utils/constants';
import logger from '../utils/logger';

/**
 * Global error handler middleware
 * @param err - Error object
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  logger.error('Error occurred', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle known operational errors
  if (err instanceof AppError) {
    const response: ApiResponse = {
      statusCode: err.statusCode,
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: (err as unknown as { details?: unknown }).details,
      },
    };
    
    res.status(err.statusCode).json(response);
    return;
  }

  const response: ApiResponse = {
    success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
    },
  };

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};

