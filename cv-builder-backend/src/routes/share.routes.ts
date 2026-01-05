/**
 * Share routes
 */

import { Router } from 'express';
import * as shareController from '../controllers/share.controller';
import { shareLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @swagger
 * /api/cvs/{id}/share:
 *   post:
 *     summary: Create share link for CV
 *     tags: [Sharing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expiresInSeconds:
 *                 type: number
 *                 default: 604800
 *     responses:
 *       201:
 *         description: Share link created successfully
 */
/**
 * @swagger
 * /api/share/{token}:
 *   get:
 *     summary: Get CV by share token (public)
 *     tags: [Sharing]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CV retrieved successfully
 */
router.get('/:token', shareLimiter, shareController.getCVByToken);

export default router;

