const AppError = require("./AppError");

class UnauthorizedError extends AppError {
  constructor(message = "Non autorisé.") {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;