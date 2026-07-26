/**
 * Réserve le stock dans une transaction Prisma.
 *
 * Cette méthode évite qu'un produit soit vendu
 * plusieurs fois si plusieurs clients commandent
 * au même moment.
 */
async function reserveStock(transaction, orderItems) {
  for (const item of orderItems) {
    const updated = await transaction.product.updateMany({
      where: {
        id: item.productId,
        isActive: true,
        stock: {
          gte: item.quantity,
        },
      },

      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });

    if (updated.count !== 1) {
      const error = new Error(
        `Le stock du produit « ${item.productName} » vient de changer.`
      );

      error.statusCode = 409;

      error.details = {
        productId: item.productId,
        productName: item.productName,
      };

      throw error;
    }
  }
}

module.exports = {
  reserveStock,
};