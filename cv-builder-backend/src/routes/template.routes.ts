/**
 * Template routes
 */

import { Router } from 'express';
import * as templateController from '../controllers/template.controller';

const router = Router();

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: Get all public templates
 *     tags: [Templates]
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
 *         description: Number of templates to return
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 */
router.get('/', templateController.getTemplates);

/**
 * @swagger
 * /api/templates/{id}:
 *   get:
 *     summary: Get template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 */
router.get('/:id', templateController.getTemplateById);

export default router;

