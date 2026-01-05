/**
 * Share service - Business logic for sharing operations
 */

import { IShareLink } from '../models/ShareLink';
import { ShareLinkRepository } from '../repositories/shareLink.repository';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';
import crypto from 'crypto';

const shareLinkRepository = new ShareLinkRepository();

/**
 * Share service class
 */
export class ShareService {
  /**
   * Create share link for CV
   * @param cvId - CV ID
   * @param expiresInSeconds - Expiration time in seconds (default: 7 days)
   * @returns Share link document
   */
  async createShareLink(cvId: string, expiresInSeconds: number = 7 * 24 * 60 * 60): Promise<IShareLink> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    return shareLinkRepository.create({
      cvId: cvId as unknown as IShareLink['cvId'],
      token,
      expiresAt,
      accessCount: 0,
    });
  }

  /**
   * Get CV by share token
   * @param token - Share token
   * @returns Share link with CV
   */
  async getCVByToken(token: string): Promise<IShareLink> {
    const shareLink = await shareLinkRepository.findByToken(token);
    if (!shareLink) {
      throw new NotFoundError('Share link');
    }

    // Increment access count
    await shareLinkRepository.incrementAccessCount(token);

    return shareLink;
  }

  /**
   * Send CV via email (placeholder)
   * @param cvId - CV ID
   * @param email - Recipient email
   */
  async sendCVByEmail(cvId: string, email: string): Promise<void> {
    // Placeholder - implement email sending
    logger.info('Sending CV via email', { cvId, email });
  }
}

