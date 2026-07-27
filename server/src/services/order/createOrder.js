const prisma = require("../../lib/prisma");

const {
  normalizeItems,
} = require("./normalizeItems");

const {
  loadProducts,
} = require("./loadProducts");

const {
  validateStock,
} = require("./validateStock");

const {
  buildOrderItems,
} = require("./buildOrderItems");

const {
  reserveStock,
} = require("./reserveStock");

const {
  calculateTotals,
} = require("./calculateTotals");

const { createQuote } = require("../quote");

const {
  generateOrderReference,
} = require("../../utils/orderReference");

async function createOrder(userId, payload) {
  // 1. Normalisation du panier
  const items = normalizeItems(payload.items);

  // 2. Chargement des produits
  const productsMap = await loadProducts(items);

  // 3. Vérification du stock
  validateStock(items, productsMap);

  // 4. Création des lignes de commande
  const {
    orderItems,
    subtotal,
  } = buildOrderItems(items, productsMap);

  // 5. Calcul des montants
  const totals = calculateTotals(
    subtotal,
    payload.shippingMethod
  );

  // 6. Transaction
  return prisma.$transaction(async (transaction) => {
    
    // Référence de commande
    const reference =
      await generateOrderReference(transaction);

    // Création de la commande
    const order = await transaction.order.create({
      data: {
        reference,

        subtotal: totals.subtotal,
        shippingCost: totals.shippingCost,
        discount: totals.discount,
        total: totals.total,

        status: "REQUESTED",
        paymentStatus: "NOT_STARTED",

        customerEmail: payload.customerEmail,
        customerNote: payload.customerNote || null,

        shippingMethod: payload.shippingMethod,

        relayPointId:
          payload.relayPointId || null,

        relayPointName:
          payload.relayPointName || null,

        shippingFirstname:
          payload.shippingAddress.firstname,

        shippingLastname:
          payload.shippingAddress.lastname,

        shippingCompany:
          payload.shippingAddress.company || null,

        shippingStreet:
          payload.shippingAddress.street,

        shippingStreet2:
          payload.shippingAddress.street2 || null,

        shippingPostalCode:
          payload.shippingAddress.postalCode,

        shippingCity:
          payload.shippingAddress.city,

        shippingCountry:
          payload.shippingAddress.country,

        shippingPhone:
          payload.shippingAddress.phone || null,

        billingFirstname:
          payload.billingAddress.firstname,

        billingLastname:
          payload.billingAddress.lastname,

        billingCompany:
          payload.billingAddress.company || null,

        billingStreet:
          payload.billingAddress.street,

        billingStreet2:
          payload.billingAddress.street2 || null,

        billingPostalCode:
          payload.billingAddress.postalCode,

        billingCity:
          payload.billingAddress.city,

        billingCountry:
          payload.billingAddress.country,

        billingPhone:
          payload.billingAddress.phone || null,

        userId,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: true,
        payments: true,
      },
    });

    return order;
  });
}

module.exports = {
  createOrder,
};