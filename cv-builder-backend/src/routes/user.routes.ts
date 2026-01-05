/**
 * User routes
 */

import { Router, RequestHandler } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', userController.getProfile as RequestHandler);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/me', userController.updateProfile as RequestHandler);

/**
 * @swagger
 * /api/users/me/avatar/presign:
 *   post:
 *     summary: Get presigned URL for avatar upload
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Presigned URL generated
 *       401:
 *         description: Unauthorized
 */
router.post('/me/avatar/presign', userController.getAvatarPresignUrl as RequestHandler);

export default router;

