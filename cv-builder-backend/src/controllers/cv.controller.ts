/**
 * CV controller - Request handlers for CV operations
 */

import { Response, NextFunction } from 'express';
import { CVService } from '../services/cv.service';
import { AuthRequest, ApiResponse, CreateCVRequest, UpdateCVRequest, AutosaveCVRequest, PaginatedResponse } from '../types';
import { HTTP_STATUS } from '../utils/constants';
import { ICV } from '../models/CV';
import { CVData } from '../types/cv';

const cvService: CVService = new CVService();

/**
 * Get user's CVs with pagination
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const getCVs = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const cursor: string | undefined = req.query.cursor as string | undefined;
    const limit: number | undefined = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const result: PaginatedResponse<ICV> = await cvService.getCVs(req.user!.userId, { cursor, limit });

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get CV by ID
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const getCVById = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const cv: ICV = await cvService.getCVById(req.params.id, req.user!.userId);

    const response: ApiResponse = {
      success: true,
      data: { cv },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new CV
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const createCV = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const body: CreateCVRequest = req.body as CreateCVRequest;
    const cv: ICV = await cvService.createCV(req.user!.userId, {
      title: body.title,
      layoutId: body.layoutId as unknown as ICV['layoutId'],
      data: body.data,
    });

    const response: ApiResponse = {
      success: true,
      data: { cv },
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Update CV
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const updateCV = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const body: UpdateCVRequest = req.body as UpdateCVRequest;
    const updateData: Partial<ICV> = {
      ...(body.title && { title: body.title }),
      ...(body.layoutId && { layoutId: body.layoutId as unknown as ICV['layoutId'] }),
      ...(body.data && { data: body.data }),
      ...(body.version && { version: body.version }),
    };
    const cv: ICV = await cvService.updateCV(req.params.id, req.user!.userId, updateData);

    const response: ApiResponse = {
      success: true,
      data: { cv },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Autosave CV
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const autosaveCV = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const body: AutosaveCVRequest = req.body as AutosaveCVRequest;
    const data: Partial<CVData> = body.data || {};
    const cv: ICV = await cvService.autosaveCV(req.params.id, req.user!.userId, data);

    const response: ApiResponse = {
      success: true,
      data: { cv },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete CV
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const deleteCV = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    await cvService.deleteCV(req.params.id, req.user!.userId);

    const response: ApiResponse = {
      success: true,
      data: { message: 'CV deleted successfully' },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Duplicate CV
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const duplicateCV = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const cv: ICV = await cvService.duplicateCV(req.params.id, req.user!.userId);

    const response: ApiResponse = {
      success: true,
      data: { cv },
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

