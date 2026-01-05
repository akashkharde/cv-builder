/**
 * Payment related types
 */

/**
 * Payment status
 */
export type PaymentStatus = 'pending' | 'succeeded' | 'failed';

/**
 * Create payment intent request
 */
export interface CreatePaymentIntentRequest {
  amountCents: number;
  currency: string;
  cvId: string;
  purpose: string;
}

/**
 * Payment intent response
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
}

/**
 * Payment record
 */
export interface PaymentRecord {
  _id: string;
  userId: string;
  cvId: string;
  amountCents: number;
  currency: string;
  providerPaymentId: string;
  status: PaymentStatus;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

