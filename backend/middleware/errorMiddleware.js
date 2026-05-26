const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  const statusCode =
    err.statusCode ||
    (err.code === 11000 ? 409 : null) ||
    (res.statusCode === 200 ? 500 : res.statusCode);

  return res.status(statusCode).json({
    success: false,
    message: err.code === 11000 ? "This record already exists" : err.message || "Internal Server Error"
  });
};

module.exports = errorMiddleware;
