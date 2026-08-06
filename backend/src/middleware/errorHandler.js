export function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 10MB.'
        : err.message,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({ message });
}

export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
}
