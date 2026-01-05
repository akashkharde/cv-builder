/**
 * Template controller - Request handlers for template operations
 */

import { Request, Response, NextFunction } from 'express';
import { TemplateService } from '../services/template.service';
import { ApiResponse } from '../types';
import { HTTP_STATUS } from '../utils/constants';
import { ITemplate } from '../models/Template';
import { PaginatedResponse } from '../types/common';

const templateService: TemplateService = new TemplateService();

/**
 * Get all public templates
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const getTemplates = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const cursor: string | undefined = req.query.cursor as string | undefined;
    const limit: number | undefined = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const result: PaginatedResponse<ITemplate> = await templateService.getTemplates({ cursor, limit });

    const response: ApiResponse = {
      statusCode: HTTP_STATUS.OK,
      success: true,
      data: result,
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get template by ID
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const getTemplateById = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const template: ITemplate = await templateService.getTemplateById(req.params.id);

    const response: ApiResponse = {
      statusCode: HTTP_STATUS.OK,
      success: true,
      data: { template },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

