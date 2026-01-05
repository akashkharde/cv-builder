/**
 * Authentication validation schemas
 */

import Joi from 'joi';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '../utils/constants';

/**
 * Registration validation schema
 */
export const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must be at most 30 characters',
      'any.required': 'Username is required',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .pattern(PASSWORD_REGEX)
    .required()
    .messages({
      'string.min': `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  phone: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  captchaToken: Joi.string().optional(),
});

/**
 * Login validation schema
 */
export const loginSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .messages({
      'any.required': 'Email or username is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

/**
 * OAuth validation schema
 */
export const oauthSchema = Joi.object({
  code: Joi.string().optional(),
  access_token: Joi.string().optional(),
});

