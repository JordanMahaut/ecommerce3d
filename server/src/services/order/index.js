// server/src/services/order/index.js

module.exports = {
  // Création
  ...require("./createOrder"),

  // Lecture
  ...require("./getOrders"),
  ...require("./getOrder"),

  // Gestion
  ...require("./cancelOrder"),
  ...require("./updateStatus"),

  // Utilitaires
  ...require("./normalizeItems"),
  ...require("./loadProducts"),
  ...require("./validateStock"),
  ...require("./buildOrderItems"),
  ...require("./reserveStock"),
  ...require("./calculateTotals"),
};