import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

const isDev = env.NODE_ENV === 'development';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 300,
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 50,
  message: { message: 'Too many auth attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

