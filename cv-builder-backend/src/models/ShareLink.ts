/**
 * Share Link model schema
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Share Link document interface
 */
export interface IShareLink extends Document {
  cvId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  accessCount: number;
  createdAt: Date;
}

/**
 * Share Link schema
 */
const ShareLinkSchema = new Schema<IShareLink>(
  {
    cvId: {
      type: Schema.Types.ObjectId,
      ref: 'CV',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ShareLinkSchema.index({ token: 1 }, { unique: true });
ShareLinkSchema.index({ expiresAt: 1 });

export const ShareLink = mongoose.model<IShareLink>('ShareLink', ShareLinkSchema);

