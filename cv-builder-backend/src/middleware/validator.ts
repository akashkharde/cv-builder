/**
 * Request validation middleware
 */

import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationError } from '../utils/errors';

/**
 * Validate request body against Joi schema
 * @param schema - Joi validation schema
 * @returns Express middleware function
 */
export const validate = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      throw new ValidationError('Validation failed', details);
    }

    req.body = value;
    next();
  };
};

