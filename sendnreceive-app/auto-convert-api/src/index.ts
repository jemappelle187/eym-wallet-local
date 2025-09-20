import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { ENV } from './env';
import { depositsRouter } from './routes/deposits';
import { usersRouter } from './routes/users';
import { momoRouter } from './routes/momo';
import { bankRouter } from './routes/bank';
import { fxRouter } from './routes/fx';
import { debugRouter } from './routes/debug';

// Initialize logger
const logger = pino({ 
  level: ENV.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your domain
    : ['http://localhost:3000', 'http://localhost:19006'], // React Native dev server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(pinoHttp({ logger }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'EYM Wallet Auto-Convert API is running',
    version: '1.0.0',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// API version info
app.get('/v1', (req, res) => {
  res.json({
    success: true,
    message: 'EYM Wallet Auto-Convert API v1',
    version: '1.0.0',
    endpoints: {
      deposits: '/v1/deposits',
      users: '/v1/users',
      health: '/health'
    },
    features: [
      'Auto-convert deposits to stablecoins',
      'Support for USD, EUR, GHS, AED, NGN',
      'Circle API integration for USDC/EURC minting',
      'FX partner integration for currency conversion',
      'Real-time balance tracking',
      'Conversion history and audit trail'
    ]
  });
});

// API routes
app.use('/v1/deposits', depositsRouter);
app.use('/v1/users', usersRouter);
app.use('/v1/momo', momoRouter);
app.use('/v1/bank', bankRouter);
app.use('/v1/fx', fxRouter);
app.use('/v1/debug', debugRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: ENV.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Start server
const server = app.listen(ENV.PORT, () => {
  logger.info(`🚀 EYM Wallet Auto-Convert API started`);
  logger.info(`📍 Server running on port ${ENV.PORT}`);
  logger.info(`🌍 Environment: ${ENV.NODE_ENV}`);
  logger.info(`🔗 Health check: http://localhost:${ENV.PORT}/health`);
  logger.info(`📚 API docs: http://localhost:${ENV.PORT}/v1`);
  
  // Log configuration
  logger.info('⚙️ Configuration:');
  logger.info(`   - Circle API: ${ENV.CIRCLE_SANDBOX ? 'Sandbox' : 'Production'}`);
  logger.info(`   - FX Partner: ${ENV.FX_PARTNER_BASE_URL ? 'Configured' : 'Simulated'}`);
  logger.info(`   - Base Currency: ${ENV.LEDGER_BASE_CURRENCY}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;








