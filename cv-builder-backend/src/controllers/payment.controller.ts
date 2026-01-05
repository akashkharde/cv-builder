/**
 * Payment controller - Request handlers for payment operations
 */

import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { AuthRequest, ApiResponse, CreatePaymentIntentRequest, PaymentIntentResponse } from '../types';
import { HTTP_STATUS } from '../utils/constants';
import { IPayment } from '../models/Payment';
import { PaginatedResponse } from '../types/common';

const paymentService: PaymentService = new PaymentService();

/**
 * Get payment history
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const getPaymentHistory = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const cursor: string | undefined = req.query.cursor as string | undefined;
    const limit: number | undefined = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const result: PaginatedResponse<IPayment> = await paymentService.getPaymentHistory(req.user!.userId, { cursor, limit });

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
 * Create payment intent
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const createPaymentIntent = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const body: CreatePaymentIntentRequest = req.body as CreatePaymentIntentRequest;
    const result: PaymentIntentResponse = await paymentService.createPaymentIntent(req.user!.userId, body);

    const response: ApiResponse = {
      statusCode: HTTP_STATUS.CREATED,
      success: true,
      data: result,
    };

    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle payment webhook
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const handleWebhook = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    await paymentService.handleWebhook(req.body);

    const response: ApiResponse = {
      statusCode: HTTP_STATUS.OK,
      success: true,
      data: { message: 'Webhook processed' },
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

