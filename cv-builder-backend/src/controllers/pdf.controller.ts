/**
 * PDF controller - Request handlers for PDF operations
 */

import { Response, NextFunction } from 'express';
import { PDFService } from '../services/pdf.service';
import { AuthRequest, ApiResponse, GeneratePDFRequest } from '../types';
import { HTTP_STATUS } from '../utils/constants';
import { IPDFJob } from '../models/PDFJob';

const pdfService: PDFService = new PDFService();

/**
 * Generate PDF for CV
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const generatePDF = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const cvId: string = req.params.id;
    const body: GeneratePDFRequest = req.body as GeneratePDFRequest;
    const { layoutId, pageSize, includeImage } = body;

    // TODO: Verify user owns the CV and has paid for download
    // For now, just create the job

    const job: IPDFJob = await pdfService.generatePDF(req.user!.userId, cvId, layoutId, {
      pageSize,
      includeImage,
    });

    const response: ApiResponse = {
      success: true,
      data: { jobId: job._id.toString() },
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get PDF job status
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const getJobStatus = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const job: IPDFJob = await pdfService.getJobStatus(req.params.jobId, req.user!.userId);

    const response: ApiResponse = {
      success: true,
      data: { job },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

