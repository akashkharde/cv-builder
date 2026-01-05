import helmet from 'helmet';
import cors from 'cors';
import { Express } from 'express';
import mongoSanitize from 'mongo-sanitize';
import { Request, Response, NextFunction } from 'express';



/**
 * Configure security headers using Helmet
 * @param app - Express application
 */
export const configureSecurity = (app: Express): void => {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }));
};

/**
 * Configure CORS
 * @param app - Express application
 */
export const configureCORS = (app: Express): void => {
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
};


const sanitizeObject = <T = unknown>(input: T): T => {
  return mongoSanitize(input) as T;
};


/**
 * MongoDB injection prevention middleware
 * Removes $ operators and dot notation from user input
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject<Record<string, unknown>>(req.body as Record<string, unknown>);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject<Record<string, string>>(req.params as Record<string, string>);
  }

  next();
};


