export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, _, res, __) => {
  if (process.env.DEV_MODE) {
    console.error("Error in middleware:", err);
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.DEV_MODE ? err.stack : null,
  });
};
