/**
 * CV routes
 */

import { Router, RequestHandler } from 'express';
import * as cvController from '../controllers/cv.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { createCVSchema, updateCVSchema, autosaveCVSchema } from '../validators/cv.validator';

const router = Router();

// All CV routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/cvs:
 *   get:
 *     summary: Get user's CVs with pagination
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of CVs to return
 *     responses:
 *       200:
 *         description: CVs retrieved successfully
 */
router.get('/', cvController.getCVs as RequestHandler);

/**
 * @swagger
 * /api/cvs:
 *   post:
 *     summary: Create a new CV
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - layoutId
 *             properties:
 *               title:
 *                 type: string
 *               layoutId:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: CV created successfully
 */
router.post('/', validate(createCVSchema), cvController.createCV as RequestHandler);

/**
 * @swagger
 * /api/cvs/{id}:
 *   get:
 *     summary: Get CV by ID
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CV retrieved successfully
 */
router.get('/:id', cvController.getCVById as RequestHandler);

/**
 * @swagger
 * /api/cvs/{id}:
 *   put:
 *     summary: Update CV
 *     tags: [CVs]
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
 *             properties:
 *               title:
 *                 type: string
 *               layoutId:
 *                 type: string
 *               data:
 *                 type: object
 *               version:
 *                 type: number
 *     responses:
 *       200:
 *         description: CV updated successfully
 */
router.put('/:id', validate(updateCVSchema), cvController.updateCV as RequestHandler);

/**
 * @swagger
 * /api/cvs/{id}/autosave:
 *   patch:
 *     summary: Autosave CV (partial update)
 *     tags: [CVs]
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
 *             properties:
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: CV autosaved successfully
 */
router.patch('/:id/autosave', validate(autosaveCVSchema), cvController.autosaveCV as RequestHandler);

/**
 * @swagger
 * /api/cvs/{id}:
 *   delete:
 *     summary: Delete CV (soft delete)
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CV deleted successfully
 */
router.delete('/:id', cvController.deleteCV as RequestHandler);

/**
 * @swagger
 * /api/cvs/{id}/duplicate:
 *   post:
 *     summary: Duplicate CV
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: CV duplicated successfully
 */
router.post('/:id/duplicate', cvController.duplicateCV as RequestHandler);

/**
 * @swagger
 * /api/cvs/{id}/share:
 *   post:
 *     summary: Create share link for CV
 *     tags: [CVs]
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
import * as shareController from '../controllers/share.controller';

router.post('/:id/share', authenticate, shareController.createShareLink as RequestHandler);

/**
 * @swagger
 * /api/cvs/{id}/email:
 *   post:
 *     summary: Send CV via email
 *     tags: [CVs]
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: CV sent successfully
 */
router.post('/:id/email', authenticate, shareController.sendCVByEmail as RequestHandler);

export default router;

