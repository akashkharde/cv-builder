/**
 * MongoDB database connection configuration
 */

import mongoose from 'mongoose';
import logger from '../utils/logger';

/**
 * Connect to MongoDB database
 * @returns Promise<void>
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri: string|undefined = process.env.MONGODB_URI;

    if(!mongoUri){
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(mongoUri);
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * @returns Promise<void>
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};

