class ErrorHandler extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
  }
}


export const errorMiddleware = (err, req, res, next) => {
  // Set default values in case the error object is missing them
  err.message = err.message || "Internal Server Error"; // Corrected typo
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    err = new ErrorHandler(`Duplicate ${Object.keys(err.keyValue)} Entered`, 400); // More dynamic message
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Json Web Token is invalid. Try again", 401); // 401 is more appropriate for auth errors
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Json Web Token is expired. Try again", 401);
  }

  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
  }

  const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};
export default  ErrorHandler;
