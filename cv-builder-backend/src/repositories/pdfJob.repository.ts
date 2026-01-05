/**
 * PDF Job repository - Data access layer for PDFJob model
 */

import { IPDFJob, PDFJob } from '../models/PDFJob';
import { NotFoundError } from '../utils/errors';

/**
 * PDF Job repository class
 */
export class PDFJobRepository {
  /**
   * Find PDF job by ID
   * @param jobId - Job ID
   * @param userId - User ID (optional, for ownership check)
   * @returns PDF job document or null
   */
  async findById(jobId: string, userId?: string): Promise<IPDFJob | null> {
    const query: { _id: string; userId?: string } = {
      _id: jobId,
    };

    if (userId) {
      query.userId = userId;
    }

    return PDFJob.findById(query).populate('cvId layoutId').exec();
  }

  /**
   * Create a new PDF job
   * @param jobData - PDF job data
   * @returns Created PDF job document
   */
  async create(jobData: Partial<IPDFJob>): Promise<IPDFJob> {
    const job = new PDFJob(jobData);
    return job.save();
  }

  /**
   * Update PDF job by ID
   * @param jobId - Job ID
   * @param updateData - Update data
   * @returns Updated PDF job document
   */
  async updateById(jobId: string, updateData: Partial<IPDFJob>): Promise<IPDFJob> {
    const job = await PDFJob.findByIdAndUpdate(
      jobId,
      { $set: updateData },
      { new: true }
    ).exec();

    if (!job) {
      throw new NotFoundError('PDF Job');
    }

    return job;
  }
}

