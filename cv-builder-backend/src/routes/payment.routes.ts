/**
 * Payment routes
 */

import { Router, RequestHandler } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Get payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 */
router.get('/history', authenticate, paymentController.getPaymentHistory as RequestHandler);

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amountCents
 *               - currency
 *               - cvId
 *               - purpose
 *             properties:
 *               amountCents:
 *                 type: number
 *               currency:
 *                 type: string
 *               cvId:
 *                 type: string
 *               purpose:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment intent created successfully
 */
router.post('/create-intent', authenticate, paymentController.createPaymentIntent as RequestHandler);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Payment webhook (Stripe)
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
router.post('/webhook', paymentController.handleWebhook);

export default router;

