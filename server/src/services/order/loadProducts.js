const prisma = require("../../lib/prisma");

/**
 * Charge tous les produits du panier.
 */
async function loadProducts(items) {
  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      isActive: true,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      stock: true,
      image: true,
      featured: true,
      categoryId: true,
    },
  });

  if (products.length !== productIds.length) {
    const foundIds = new Set(products.map((p) => p.id));

    const missingProducts = productIds.filter(
      (id) => !foundIds.has(id),
    );

    const error = new Error(
      "Un ou plusieurs produits sont introuvables ou inactifs.",
    );

    error.statusCode = 404;
    error.details = {
      missingProducts,
    };

    throw error;
  }

  return new Map(
    products.map((product) => [
      product.id,
      product,
    ]),
  );
}

module.exports = {
  loadProducts,
};