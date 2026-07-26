const prisma = require("../../lib/prisma");

/**
 * Récupère une commande appartenant à l'utilisateur connecté.
 */
async function getOrder(userId, orderId) {
  const order = await prisma.order.findFirst({
    where: {
      id: Number(orderId),
      userId,
    },

    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              image: true,
            },
          },
        },
      },

      payments: true,

      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    const error = new Error("Commande introuvable.");

    error.statusCode = 404;

    throw error;
  }

  return order;
}

module.exports = {
  getOrder,
};