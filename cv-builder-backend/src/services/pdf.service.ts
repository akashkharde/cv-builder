/**
 * PDF service - Business logic for PDF generation
 */

import { IPDFJob } from '../models/PDFJob';
import { PDFJobRepository } from '../repositories/pdfJob.repository';
import { NotFoundError } from '../utils/errors';

const pdfJobRepository = new PDFJobRepository();

/**
 * PDF service class
 */
export class PDFService {
  /**
   * Generate PDF for CV (creates async job)
   * @param userId - User ID
   * @param cvId - CV ID
   * @param layoutId - Layout ID
   * @param options - PDF generation options
   * @returns PDF job document
   */
  async generatePDF(
    userId: string,
    cvId: string,
    layoutId: string,
    _options: { pageSize?: string; includeImage?: boolean } = {} // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<IPDFJob> {
    // Create PDF job (will be processed by worker)
    const job = await pdfJobRepository.create({
      userId: userId as unknown as IPDFJob['userId'],
      cvId: cvId as unknown as IPDFJob['cvId'],
      layoutId: layoutId as unknown as IPDFJob['layoutId'],
      jobStatus: 'queued',
      attempts: 0,
    });

    // TODO: Queue job for worker to process
    // For now, just return the job

    return job;
  }

  /**
   * Get PDF job status
   * @param jobId - Job ID
   * @param userId - User ID
   * @returns PDF job document
   */
  async getJobStatus(jobId: string, userId: string): Promise<IPDFJob> {
    const job = await pdfJobRepository.findById(jobId, userId);
    if (!job) {
      throw new NotFoundError('PDF Job');
    }
    return job;
  }
}

