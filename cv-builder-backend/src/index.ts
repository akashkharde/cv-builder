import express, { Express } from 'express';
import { connectDatabase } from './config/database';
import { setupSwagger } from './config/swagger';
import { configureSecurity, configureCORS, sanitizeInput } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { apiLimiter } from './middleware/rateLimiter';
import cookieParser from 'cookie-parser';
import logger from './utils/logger';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import templateRoutes from './routes/template.routes';
import cvRoutes from './routes/cv.routes';
import paymentRoutes from './routes/payment.routes';
import shareRoutes from './routes/share.routes';



const app: Express = express();
const PORT = process.env.PORT || 8000;

// Security middleware
configureSecurity(app);
configureCORS(app);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/share', shareRoutes);

// PDF routes
import pdfRoutes from './routes/pdf.routes';
app.use('/api', pdfRoutes);

// Setup Swagger
setupSwagger(app);

// 404 handler
app.use(notFoundHandler);

app.use(errorHandler);

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start server
void startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  void (async () => {
    const { disconnectDatabase } = await import('./config/database');
    await disconnectDatabase();
    process.exit(0);
  })();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  void (async () => {
    const { disconnectDatabase } = await import('./config/database');
    await disconnectDatabase();
    process.exit(0);
  })();
});
