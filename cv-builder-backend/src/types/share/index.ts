/**
 * Sharing related types
 */

/**
 * Create share link request
 */
export interface CreateShareLinkRequest {
  expiresInSeconds?: number;
}

/**
 * Share link response
 */
export interface ShareLinkResponse {
  token: string;
  shareUrl: string;
  expiresAt: Date;
}

/**
 * Send CV email request
 */
export interface SendCVEmailRequest {
  email: string;
}

