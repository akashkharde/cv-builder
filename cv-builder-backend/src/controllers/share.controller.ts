/**
 * Share controller - Request handlers for sharing operations
 */

import { Request, Response, NextFunction } from 'express';
import { ShareService } from '../services/share.service';
import { AuthRequest, ApiResponse, CreateShareLinkRequest, SendCVEmailRequest } from '../types';
import { HTTP_STATUS } from '../utils/constants';
import { IShareLink } from '../models/ShareLink';

const shareService: ShareService = new ShareService();

/**
 * Create share link for CV
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const createShareLink = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const cvId: string = req.params.id;
    const body: CreateShareLinkRequest = req.body as CreateShareLinkRequest;
    const expiresInSeconds: number | undefined = body.expiresInSeconds;

    const shareLink: IShareLink = await shareService.createShareLink(cvId, expiresInSeconds);

    const response: ApiResponse = {
      success: true,
            statusCode: HTTP_STATUS.CREATED,
      data: {
        token: shareLink.token,
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/share/${shareLink.token}`,
        expiresAt: shareLink.expiresAt,
      },
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get CV by share token (public)
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const getCVByToken = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const shareLink: IShareLink = await shareService.getCVByToken(req.params.token);

    const response: ApiResponse = {
            statusCode: HTTP_STATUS.OK,
      success: true,
      data: {
        cv: shareLink.cvId,
      },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Send CV via email
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const sendCVByEmail = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const cvId: string = req.params.id;
    const body: SendCVEmailRequest = req.body as SendCVEmailRequest;
    const email: string = body.email;

    // TODO: Verify user owns the CV and has paid for email share
    await shareService.sendCVByEmail(cvId, email);

    const response: ApiResponse = {
            statusCode: HTTP_STATUS.OK,
      
      success: true,
      data: { message: 'CV sent successfully' },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

