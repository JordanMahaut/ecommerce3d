const AppError = require("./AppError");

class ForbiddenError extends AppError {
  constructor(message = "Accès interdit.") {
    super(message, 403);
  }
}

module.exports = ForbiddenError;