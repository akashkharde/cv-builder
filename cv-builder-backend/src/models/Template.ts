/**
 * Template (Layout) model schema
 */

import mongoose, { Document, Schema } from 'mongoose';


/**
 * Template document interface
 */
export interface ITemplate extends Document {
  name: string;
  slug: string;
  description: string;
  previewImageUrl?: string;
  layoutStructure: any;
  defaultTheme: any;
  isPremium: boolean;
  tags: string[];
  assets: any[];
  isActive: boolean;
  version: number;
  createdBy?: mongoose.Types.ObjectId;
  public: boolean;
  versions: any[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Template schema
 */
const TemplateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    previewImageUrl: String,
    layoutStructure: {
      type: Schema.Types.Mixed,
      required: true,
    },
    defaultTheme: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    assets: [Schema.Types.Mixed],
    isActive: {
      type: Boolean,
      default: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    public: {
      type: Boolean,
      default: true,
    },
    versions: [Schema.Types.Mixed],
  },
  {
    timestamps: true,
  }
);

// Indexes
TemplateSchema.index({ public: 1, name: 1 });
TemplateSchema.index({ createdAt: -1 });

export const Template = mongoose.model<ITemplate>('Template', TemplateSchema);

