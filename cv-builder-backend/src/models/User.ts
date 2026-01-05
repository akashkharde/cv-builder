/**
 * User model schema
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * OAuth provider information
 */
interface OAuthProvider {
  provider: 'google' | 'facebook';
  providerId: string;
}

/**
 * Refresh token information
 */
interface RefreshToken {
  tokenHash: string;
  createdAt: Date;
  revokedAt?: Date;
}

/**
 * User settings
 */
interface UserSettings {
  theme?: string;
  defaultLayoutId?: string;
  privacy?: Record<string, unknown>;
}

/**
 * User document interface
 */
export interface IUser extends Document {
  username: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  oauthProviders: OAuthProvider[];
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  avatarUrl?: string;
  settings: UserSettings;
  refreshTokens: RefreshToken[];
}

/**
 * User schema
 */
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false, // Don't return password by default
    },
    oauthProviders: [
      {
        provider: {
          type: String,
          enum: ['google', 'facebook'],
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
    },
    settings: {
      theme: String,
      defaultLayoutId: String,
      privacy: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },
    refreshTokens: [
      {
        tokenHash: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        revokedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ createdAt: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);

