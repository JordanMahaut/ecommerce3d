const { AppError } = require("../errors");

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        type: error.name,
        message: error.message,
        details: error.details ?? null,
      },
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    error: {
      type: "InternalServerError",
      message: "Une erreur interne est survenue.",
    },
  });
}

module.exports = errorHandler;