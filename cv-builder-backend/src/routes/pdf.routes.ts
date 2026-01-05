/**
 * PDF routes
 */

import { Router, RequestHandler } from 'express';
import * as pdfController from '../controllers/pdf.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All PDF routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/cvs/{id}/generate-pdf:
 *   post:
 *     summary: Generate PDF for CV (requires payment)
 *     tags: [PDF]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - layoutId
 *             properties:
 *               layoutId:
 *                 type: string
 *               pageSize:
 *                 type: string
 *               includeImage:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: PDF generation job created
 */
router.post('/cvs/:id/generate-pdf', pdfController.generatePDF as RequestHandler);

/**
 * @swagger
 * /api/pdf-jobs/{jobId}:
 *   get:
 *     summary: Get PDF job status
 *     tags: [PDF]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job status retrieved successfully
 */
router.get('/pdf-jobs/:jobId', pdfController.getJobStatus as RequestHandler);

export default router;

