const prisma = require("../../lib/prisma");

/**
 * Récupère toutes les commandes d'un utilisateur.
 */
async function getOrders(userId) {
  return prisma.order.findMany({
    where: {
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
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

module.exports = {
  getOrders,
};