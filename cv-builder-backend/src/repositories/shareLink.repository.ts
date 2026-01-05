/**
 * Share Link repository - Data access layer for ShareLink model
 */

import { IShareLink, ShareLink } from '../models/ShareLink';
import { NotFoundError } from '../utils/errors';

/**
 * Share Link repository class
 */
export class ShareLinkRepository {
  /**
   * Find share link by token
   * @param token - Share token
   * @returns Share link document or null
   */
  async findByToken(token: string): Promise<IShareLink | null> {
    return ShareLink.findOne({
      token,
      expiresAt: { $gt: new Date() },
    }).populate('cvId').exec();
  }

  /**
   * Create a new share link
   * @param shareData - Share link data
   * @returns Created share link document
   */
  async create(shareData: Partial<IShareLink>): Promise<IShareLink> {
    const shareLink = new ShareLink(shareData);
    return shareLink.save();
  }

  /**
   * Increment access count
   * @param token - Share token
   * @returns Updated share link document
   */
  async incrementAccessCount(token: string): Promise<IShareLink> {
    const shareLink = await ShareLink.findOneAndUpdate(
      { token },
      { $inc: { accessCount: 1 } },
      { new: true }
    ).exec();

    if (!shareLink) {
      throw new NotFoundError('Share Link');
    }

    return shareLink;
  }
}

