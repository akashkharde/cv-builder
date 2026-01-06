/**
 * Authentication controller - Request handlers for authentication
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse, RegisterRequest, LoginRequest } from '../types';
import { HTTP_STATUS } from '../utils/constants';

const authService: AuthService = new AuthService();

/**
 * Register a new user
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const register = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const body: RegisterRequest = req.body as RegisterRequest;
    const { user, accessToken, refreshToken } = await authService.register(body);

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        accessToken,
      },
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const login = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const body: LoginRequest = req.body as LoginRequest;
    const { identifier, password } = body;
    const { user, accessToken, refreshToken } = await authService.login(identifier, password);

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        accessToken,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const refresh = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const body: { refreshToken?: string } = req.body as { refreshToken?: string };
    const refreshToken: string | undefined = (req.cookies?.refreshToken as string | undefined) || body.refreshToken;

    if (!refreshToken) {
      return next(new Error('Refresh token required'));
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);

    // Set new refresh token as HttpOnly cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const response: ApiResponse = {
      success: true,
      data: {
        accessToken,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const logout = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const body: { refreshToken?: string } = req.body as { refreshToken?: string };
    const refreshToken: string | undefined = (req.cookies?.refreshToken as string | undefined) || body.refreshToken;
    const userId: string | undefined = (req as { user?: { userId: string } }).user?.userId;

    if (refreshToken && userId) {
      await authService.logout(userId, refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    const response: ApiResponse = {
      success: true,
      data: { message: 'Logged out successfully' },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * OAuth login (placeholder - to be implemented)
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const oauth = (
  _req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  try {
    // OAuth implementation will be added later
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'OAuth not yet implemented',
      },
    };

    res.status(HTTP_STATUS.NOT_FOUND).json(response);
  } catch (error) {
    next(error);
  }
};

