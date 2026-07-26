const { Prisma } = require("@prisma/client");

/**
 * Construit les lignes de commande
 * et calcule le sous-total.
 */
function buildOrderItems(items, productsMap) {
  const orderItems = [];

  let subtotal = new Prisma.Decimal("0.00");

  for (const item of items) {
    const product = productsMap.get(item.productId);

    const price = new Prisma.Decimal(product.price);

    subtotal = subtotal.plus(
      price.times(item.quantity)
    );

    orderItems.push({
      productId: product.id,
      quantity: item.quantity,

      price,

      productName: product.name,
      productSlug: product.slug,
      productImage: product.image,
    });
  }

  return {
    orderItems,
    subtotal,
  };
}

module.exports = {
  buildOrderItems,
};