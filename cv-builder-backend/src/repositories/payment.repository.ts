/**
 * Payment repository - Data access layer for Payment model
 */

import { IPayment, Payment } from '../models/Payment';
import { PaginationParams, PaginatedResponse } from '../types';
import { DEFAULT_PAGINATION } from '../utils/constants';

/**
 * Payment repository class
 */
export class PaymentRepository {
  /**
   * Find payment by provider payment ID
   * @param providerPaymentId - Provider payment ID
   * @returns Payment document or null
   */
  async findByProviderPaymentId(providerPaymentId: string): Promise<IPayment | null> {
    return Payment.findOne({ providerPaymentId }).exec();
  }

  /**
   * Find payments by user ID with pagination
   * @param userId - User ID
   * @param params - Pagination parameters
   * @returns Paginated payments
   */
  async findByUserId(
    userId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<IPayment>> {
    const limit = Math.min(params.limit || DEFAULT_PAGINATION.LIMIT, DEFAULT_PAGINATION.MAX_LIMIT);
    
    const query: { userId: string; _id?: { $lt: string } } = {
      userId,
    };

    if (params.cursor) {
      query._id = { $lt: params.cursor };
    }

    const payments = await Payment.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate('cvId', 'title')
      .exec();

    const hasMore = payments.length > limit;
    const data = hasMore ? payments.slice(0, limit) : payments;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1]._id.toString() : undefined;

    return {
      data,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Create a new payment
   * @param paymentData - Payment data
   * @returns Created payment document
   */
  async create(paymentData: Partial<IPayment>): Promise<IPayment> {
    const payment = new Payment(paymentData);
    return payment.save();
  }

  /**
   * Update payment by provider payment ID
   * @param providerPaymentId - Provider payment ID
   * @param updateData - Update data
   * @returns Updated payment document
   */
  async updateByProviderPaymentId(
    providerPaymentId: string,
    updateData: Partial<IPayment>
  ): Promise<IPayment | null> {
    return Payment.findOneAndUpdate(
      { providerPaymentId },
      { $set: updateData },
      { new: true }
    ).exec();
  }
}

