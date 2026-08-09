import { Router } from 'express';
import authRoutes from './authRoutes.js';
import caseRoutes from './caseRoutes.js';
import reportRoutes from './reportRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import workflowRoutes from './workflowRoutes.js';
import userRoutes from './userRoutes.js';
import supabase from '../config/supabase.js';
import { authController } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../validators/authValidator.js';
import { authLimiter } from '../middleware/rateLimiter.js';

import aiRoutes from './aiRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = Router();

// Primary Auth Routes (/api/auth/signup, /api/auth/login, /api/auth/me)
router.use('/auth', authRoutes);

// Direct Route Aliases (/api/signup, /api/login)
router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Resource Routes
router.use('/cases', caseRoutes);
router.use('/reports', reportRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/uploads', uploadRoutes);
router.use('/workflow', workflowRoutes);
router.use('/users', userRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);

// Health & Root Status
router.get('/', (req, res) => {
  res.json({ name: 'Verisight AI Backend API', status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Temporary test endpoint under /api/test
router.post('/test', async (req, res) => {
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
        return res.status(500).json({ success: false, error: userErr.message });
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
      return res.status(500).json({ success: false, error: insertError.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase connection working.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
