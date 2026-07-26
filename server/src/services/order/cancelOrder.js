const prisma = require("../../lib/prisma");

/**
 * Annule une commande.
 */
async function cancelOrder(userId, orderId) {
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findFirst({
      where: {
        id: Number(orderId),
        userId,
      },

      include: {
        items: true,
      },
    });

    if (!order) {
      const error = new Error("Commande introuvable.");

      error.statusCode = 404;

      throw error;
    }

    const cancellableStatuses = [
      "REQUESTED",
      "UNDER_REVIEW",
      "APPROVED",
    ];

    if (!cancellableStatuses.includes(order.status)) {
      const error = new Error(
        "Cette commande ne peut plus être annulée."
      );

      error.statusCode = 409;

      throw error;
    }

    /*
     * Remise du stock
     */
    for (const item of order.items) {
      if (!item.productId) continue;

      await transaction.product.update({
        where: {
          id: item.productId,
        },

        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    return transaction.order.update({
      where: {
        id: order.id,
      },

      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason:
          "Annulation demandée par le client.",
      },

      include: {
        items: true,
        payments: true,
      },
    });
  });
}

module.exports = {
  cancelOrder,
};