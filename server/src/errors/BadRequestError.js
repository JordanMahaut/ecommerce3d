const AppError = require("./AppError");

class BadRequestError extends AppError {
  constructor(message = "Requête invalide.", details = null) {
    super(message, 400, details);
  }
}

module.exports = BadRequestError;