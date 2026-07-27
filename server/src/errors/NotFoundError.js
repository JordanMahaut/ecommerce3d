const AppError = require("./AppError");

class NotFoundError extends AppError {
  constructor(message = "Ressource introuvable.") {
    super(message, 404);
  }
}

module.exports = NotFoundError;