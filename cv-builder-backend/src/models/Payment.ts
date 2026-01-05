/**
 * Payment model schema
 */

import mongoose, { Document, Schema } from 'mongoose';
import { PaymentStatus } from '../types';

/**
 * Payment document interface
 */
export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  cvId: mongoose.Types.ObjectId;
  amountCents: number;
  currency: string;
  providerPaymentId: string;
  status: PaymentStatus;
  createdAt: Date;
  metadata: Record<string, unknown>;
}

/**
 * Payment schema
 */
const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cvId: {
      type: Schema.Types.ObjectId,
      ref: 'CV',
      required: true,
    },
    amountCents: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    providerPaymentId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PaymentSchema.index({ providerPaymentId: 1 });
PaymentSchema.index({ userId: 1, createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

