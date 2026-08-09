process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '128';

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env.js';
import corsMiddleware from './config/cors.js';
import { supabase, testConnection } from './config/supabase.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import logger from './utils/logger.js';

const app = express();
app.set('trust proxy', 1);

// ---------------------
// Security Middleware
// ---------------------
app.use(helmet());
app.use(corsMiddleware);

// ---------------------
// Parsing
// ---------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------------------
// Logging
// ---------------------
app.use(morgan('dev'));

// ---------------------
// Temporary Testing Endpoint: POST /test
// ---------------------
app.post('/test', async (req, res) => {
  try {
    let { data: user } = await supabase.from('users').select('id').limit(1).maybeSingle();

    if (!user) {
      const { data: newUser, error: userErr } = await supabase
        .from('users')
        .insert({
          name: 'Hackathon User',
          email: `hackathon-${Date.now()}@verisight.ai`,
          password: 'test-password',
          role: 'user',
        })
        .select('id')
        .single();

      if (userErr) {
        return res.status(500).json({
          success: false,
          error: userErr.message,
        });
      }
      user = newUser;
    }

    const { error: insertError } = await supabase
      .from('cases')
      .insert({
        user_id: user.id,
        title: 'Hackathon Test Case',
        description: 'Testing Supabase connection',
        priority: 'high',
        status: 'open',
      });

    if (insertError) {
      return res.status(500).json({
        success: false,
        error: insertError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase connection working.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ---------------------
// Rate Limiting & Routes
// ---------------------
app.use('/api', apiLimiter);
app.use('/uploads', express.static('src/uploads'));
app.use('/api', routes);
app.use('/', routes); // Fallback route support for /auth/login, /cases, etc.

// ---------------------
// Error Handling
// ---------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------
const PORT = env.PORT || 5000;

async function startServer() {
  try {
    await testConnection();

    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Verisight AI High-Capacity Server running on 0.0.0.0:${PORT}`);
      logger.info(`📡 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 API: http://0.0.0.0:${PORT}/api`);
    });

    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
    server.maxHeadersCount = 2000;
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

export default app;
