/**
 * Vérifie que le stock est suffisant
 * pour chaque produit du panier.
 */
function validateStock(items, productsMap) {
  for (const item of items) {
    const product = productsMap.get(item.productId);

    if (!product) {
      const error = new Error(
        `Produit ${item.productId} introuvable.`,
      );

      error.statusCode = 404;

      throw error;
    }

    if (!product.isActive) {
      const error = new Error(
        `Le produit « ${product.name} » est indisponible.`,
      );

      error.statusCode = 400;

      throw error;
    }

    const stock = Number(product.stock);

    if (stock <= 0) {
      const error = new Error(
        `Le produit « ${product.name} » est en rupture de stock.`,
      );

      error.statusCode = 409;

      throw error;
    }

    if (stock < item.quantity) {
      const error = new Error(
        `Stock insuffisant pour « ${product.name} ». Disponible : ${stock}.`,
      );

      error.statusCode = 409;

      error.details = {
        productId: product.id,
        available: stock,
        requested: item.quantity,
      };

      throw error;
    }
  }
}

module.exports = {
  validateStock,
};