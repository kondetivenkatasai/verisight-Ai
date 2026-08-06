import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Railway health checks)
    if (!origin || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin) || origin.endsWith('.up.railway.app') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback for production API connectivity
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default cors(corsOptions);
