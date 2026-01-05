/**
 * User related types
 */

/**
 * User profile update data
 */
export interface UserProfileUpdate {
  phone?: string;
  settings?: {
    theme?: string;
    defaultLayoutId?: string;
    privacy?: Record<string, unknown>;
  };
}

/**
 * User profile response
 */
export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  avatarUrl?: string;
  settings: {
    theme?: string;
    defaultLayoutId?: string;
    privacy?: Record<string, unknown>;
  };
  createdAt: Date;
  updatedAt: Date;
}

