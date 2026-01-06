/**
 * Common types and interfaces
 */

import { Request } from 'express';

/**
 * Extended Express Request with user information
 */
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

/**
 * Standard API Response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  cursor?: string;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

