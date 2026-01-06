/**
 * CV model schema
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Basic details structure
 */
interface BasicDetails {
  image?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  introductoryParagraph?: string;
}

/**
 * Education entry
 */
interface Education {
  degreeName?: string;
  institution?: string;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
  fieldOfStudy?: string;
}

/**
 * Experience entry
 */
interface Experience {
  organizationName?: string;
  joiningLocation?: string;
  position?: string;
  ctc?: string;
  joiningDate?: Date;
  leavingDate?: Date;
  duration?: string;
  technologies?: string[];
  description?: string;
}

/**
 * Project entry
 */
interface Project {
  projectTitle?: string;
  teamSize?: number;
  duration?: string;
  technologies?: string[];
  description?: string;
}

/**
 * Skill entry
 */
interface Skill {
  skillName?: string;
  perfection?: number; // percentage
  category?: 'technical' | 'interpersonal';
}

/**
 * Social profile entry
 */
interface SocialProfile {
  platformName?: string;
  profileLink?: string;
}

/**
 * CV data structure
 */
interface CVData {
  basicDetails?: BasicDetails;
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  skills?: Skill[];
  socialProfiles?: SocialProfile[];
}

/**
 * CV document interface
 */
export interface ICV extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  layoutId: mongoose.Types.ObjectId;
  data: CVData;
  previewHtmlCachedPath?: string;
  lastSavedAt: Date;
  version: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * CV schema
 */
const CVSchema = new Schema<ICV>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    layoutId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    data: {
      basicDetails: {
        image: String,
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        introductoryParagraph: String,
      },
      education: [
        {
          degreeName: String,
          institution: String,
          percentage: Number,
          startDate: Date,
          endDate: Date,
          fieldOfStudy: String,
        },
      ],
      experience: [
        {
          organizationName: String,
          joiningLocation: String,
          position: String,
          ctc: String,
          joiningDate: Date,
          leavingDate: Date,
      duration: String,
          technologies: [String],
          description: String,
        },
      ],
      projects: [
        {
          projectTitle: String,
          teamSize: Number,
          duration: String,
          technologies: [String],
          description: String,
        },
      ],
      skills: [
        {
          skillName: String,
          perfection: Number,
          category: {
            type: String,
            enum: ['technical', 'interpersonal'],
          },
        },
      ],
      socialProfiles: [
        {
          platformName: String,
          profileLink: String,
        },
      ],
    },
    previewHtmlCachedPath: {
      type: String,
    },
    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CVSchema.index({ userId: 1, createdAt: -1 });
CVSchema.index({ userId: 1, isDeleted: 1 });

export const CV = mongoose.model<ICV>('CV', CVSchema);

