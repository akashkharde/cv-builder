/**
 * PDF Job model schema for async PDF generation
 */

import mongoose, { Document, Schema } from 'mongoose';
import { PDFJobStatus } from '../types';

/**
 * PDF Job document interface
 */
export interface IPDFJob extends Document {
  cvId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  layoutId: mongoose.Types.ObjectId;
  jobStatus: PDFJobStatus;
  pdfS3Path?: string;
  attempts: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PDF Job schema
 */
const PDFJobSchema = new Schema<IPDFJob>(
  {
    cvId: {
      type: Schema.Types.ObjectId,
      ref: 'CV',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    layoutId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    jobStatus: {
      type: String,
      enum: ['queued', 'processing', 'ready', 'failed'],
      default: 'queued',
      index: true,
    },
    pdfS3Path: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PDFJobSchema.index({ jobStatus: 1, createdAt: 1 });
PDFJobSchema.index({ userId: 1, createdAt: -1 });

export const PDFJob = mongoose.model<IPDFJob>('PDFJob', PDFJobSchema);

