const prisma = require("../../lib/prisma");

const STATUS_DATES = {
  APPROVED: "approvedAt",
  REJECTED: "rejectedAt",
  PAID: "paidAt",
  PRINTING: "printingStartedAt",
  READY: "readyAt",
  SHIPPED: "shippedAt",
  DELIVERED: "deliveredAt",
  CANCELLED: "cancelledAt",
};

const ALLOWED_STATUSES = [
  "REQUESTED",
  "UNDER_REVIEW",
  "NEEDS_INFORMATION",
  "APPROVED",
  "AWAITING_PAYMENT",
  "PARTIALLY_PAID",
  "PAID",
  "PRINTING",
  "READY",
  "SHIPPED",
  "DELIVERED",
  "REJECTED",
  "CANCELLED",
];

/**
 * Mise à jour du statut d'une commande.
 */
async function updateStatus(orderId, status) {
  if (!ALLOWED_STATUSES.includes(status)) {
    const error = new Error("Statut de commande invalide.");

    error.statusCode = 400;

    throw error;
  }

  const order = await prisma.order.findUnique({
    where: {
      id: Number(orderId),
    },
  });

  if (!order) {
    const error = new Error("Commande introuvable.");

    error.statusCode = 404;

    throw error;
  }

  const data = {
    status,
  };

  const dateField = STATUS_DATES[status];

  if (dateField) {
    data[dateField] = new Date();
  }

  return prisma.order.update({
    where: {
      id: Number(orderId),
    },

    data,

    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },

      items: true,

      payments: true,
    },
  });
}

module.exports = {
  updateStatus,
};