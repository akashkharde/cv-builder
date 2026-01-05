/**
 * PDF generation related types
 */

/**
 * PDF Job status
 */
export type PDFJobStatus = 'queued' | 'processing' | 'ready' | 'failed';

/**
 * Generate PDF request
 */
export interface GeneratePDFRequest {
  layoutId: string;
  pageSize?: string;
  includeImage?: boolean;
}

/**
 * PDF Job response
 */
export interface PDFJobResponse {
  jobId: string;
}

/**
 * PDF Job status response
 */
export interface PDFJobStatusResponse {
  job: {
    _id: string;
    cvId: string;
    userId: string;
    layoutId: string;
    jobStatus: PDFJobStatus;
    pdfS3Path?: string;
    attempts: number;
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

