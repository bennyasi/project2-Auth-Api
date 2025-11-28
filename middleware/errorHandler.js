export default function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  if (res.headersSent) return next(err);

  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
}
