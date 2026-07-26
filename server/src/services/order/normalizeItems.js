/**
 * Normalise les produits reçus depuis le panier.
 *
 * Accepte :
 * { productId: 1, quantity: 2 }
 *
 * ou :
 * { id: 1, quantity: 2 }
 *
 * Les produits identiques sont regroupés.
 */
function normalizeItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  const itemsByProductId = new Map();

  for (const item of items) {
    const productId = Number(item.productId ?? item.id);
    const quantity = Number(item.quantity);

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      const error = new Error(
        "Un ou plusieurs produits du panier sont invalides.",
      );

      error.statusCode = 400;

      throw error;
    }

    const currentQuantity =
      itemsByProductId.get(productId) || 0;

    itemsByProductId.set(
      productId,
      currentQuantity + quantity,
    );
  }

  return Array.from(
    itemsByProductId,
    ([productId, quantity]) => ({
      productId,
      quantity,
    }),
  );
}

module.exports = {
  normalizeItems,
};