const { Prisma } = require("@prisma/client");

const prisma = require("../lib/prisma");
const {
  generateOrderReference,
} = require("../utils/orderReference");

/**
 * Frais de livraison temporaires.
 *
 * Tu pourras modifier ces montants lorsque tu auras choisi
 * précisément tes transporteurs et leurs tarifs.
 */
const SHIPPING_COSTS = {
  COLISSIMO: new Prisma.Decimal("0.00"),
  MONDIAL_RELAY: new Prisma.Decimal("0.00"),
  CHRONOPOST: new Prisma.Decimal("0.00"),
  PICKUP: new Prisma.Decimal("0.00"),
};

/**
 * Crée une erreur avec un code HTTP.
 */
function createServiceError(message, statusCode = 400, details = null) {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.details = details;

  return error;
}

/**
 * Regroupe les produits identiques présents plusieurs fois dans le panier.
 *
 * Exemple :
 * [
 *   { productId: 1, quantity: 2 },
 *   { productId: 1, quantity: 3 }
 * ]
 *
 * devient :
 * [
 *   { productId: 1, quantity: 5 }
 * ]
 */
function mergeDuplicateItems(items) {
  const itemsMap = new Map();

  for (const item of items) {
    const currentQuantity = itemsMap.get(item.productId) || 0;

    itemsMap.set(
      item.productId,
      currentQuantity + item.quantity,
    );
  }

  return Array.from(itemsMap, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

/**
 * Transforme une valeur vide en null.
 */
function emptyToNull(value) {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const normalizedValue = value.trim();

  return normalizedValue === "" ? null : normalizedValue;
}

/**
 * Créer une commande.
 */
async function createOrder(userId, payload) {
  const normalizedItems = mergeDuplicateItems(payload.items);

  const productIds = normalizedItems.map(
    (item) => item.productId,
  );

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
      price: true,
      stock: true,
      image: true,
    },
  });

  /*
   * Vérifie que tous les produits existent et sont actifs.
   */
  if (products.length !== productIds.length) {
    const foundProductIds = new Set(
      products.map((product) => product.id),
    );

    const unavailableProductIds = productIds.filter(
      (productId) => !foundProductIds.has(productId),
    );

    throw createServiceError(
      "Un ou plusieurs produits sont indisponibles.",
      400,
      {
        productIds: unavailableProductIds,
      },
    );
  }

  const productsMap = new Map(
    products.map((product) => [product.id, product]),
  );

  /*
   * Vérification initiale des stocks.
   *
   * Une seconde vérification atomique sera effectuée
   * pendant la transaction.
   */
  for (const item of normalizedItems) {
    const product = productsMap.get(item.productId);

    if (product.stock < item.quantity) {
      throw createServiceError(
        `Stock insuffisant pour le produit « ${product.name} ».`,
        409,
        {
          productId: product.id,
          productName: product.name,
          requestedQuantity: item.quantity,
          availableStock: product.stock,
        },
      );
    }
  }

  /*
   * Préparation des lignes de commande.
   *
   * Le prix et les informations du produit sont récupérés
   * depuis la base, jamais depuis le navigateur.
   */
  const orderItems = normalizedItems.map((item) => {
    const product = productsMap.get(item.productId);

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.image,
    };
  });

  const subtotal = orderItems.reduce(
    (total, item) =>
      total.plus(
        new Prisma.Decimal(item.price).times(item.quantity),
      ),
    new Prisma.Decimal("0.00"),
  );

  const shippingCost =
    SHIPPING_COSTS[payload.shippingMethod] ||
    new Prisma.Decimal("0.00");

  const discount = new Prisma.Decimal("0.00");

  const total = subtotal
    .plus(shippingCost)
    .minus(discount);

  const shippingAddress = payload.shippingAddress;
  const billingAddress = payload.billingAddress;

  return prisma.$transaction(async (transaction) => {
    /*
     * Décrémentation atomique du stock.
     *
     * updateMany ne modifie le produit que si son stock
     * est encore suffisant au moment précis de la commande.
     */
    for (const item of normalizedItems) {
      const product = productsMap.get(item.productId);

      const stockUpdate = await transaction.product.updateMany({
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

      if (stockUpdate.count !== 1) {
        throw createServiceError(
          `Le stock du produit « ${product.name} » vient de changer.`,
          409,
          {
            productId: product.id,
            productName: product.name,
          },
        );
      }
    }

    const reference =
      await generateOrderReference(transaction);

    const order = await transaction.order.create({
      data: {
        reference,

        subtotal,
        shippingCost,
        discount,
        total,

        customerEmail: payload.customerEmail.trim(),
        customerNote: emptyToNull(payload.customerNote),

        shippingMethod: payload.shippingMethod,

        relayPointId:
          payload.shippingMethod === "MONDIAL_RELAY"
            ? emptyToNull(payload.relayPointId)
            : null,

        relayPointName:
          payload.shippingMethod === "MONDIAL_RELAY"
            ? emptyToNull(payload.relayPointName)
            : null,

        shippingFirstname: shippingAddress.firstname.trim(),
        shippingLastname: shippingAddress.lastname.trim(),
        shippingCompany: emptyToNull(
          shippingAddress.company,
        ),
        shippingStreet: shippingAddress.street.trim(),
        shippingStreet2: emptyToNull(
          shippingAddress.street2,
        ),
        shippingPostalCode:
          shippingAddress.postalCode.trim(),
        shippingCity: shippingAddress.city.trim(),
        shippingCountry: shippingAddress.country.trim(),
        shippingPhone: emptyToNull(
          shippingAddress.phone,
        ),

        billingFirstname: billingAddress.firstname.trim(),
        billingLastname: billingAddress.lastname.trim(),
        billingCompany: emptyToNull(
          billingAddress.company,
        ),
        billingStreet: billingAddress.street.trim(),
        billingStreet2: emptyToNull(
          billingAddress.street2,
        ),
        billingPostalCode:
          billingAddress.postalCode.trim(),
        billingCity: billingAddress.city.trim(),
        billingCountry: billingAddress.country.trim(),
        billingPhone: emptyToNull(
          billingAddress.phone,
        ),

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

/**
 * Récupérer les commandes de l'utilisateur connecté.
 */
async function getUserOrders(userId) {
  return prisma.order.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      items: true,

      payments: true,
    },
  });
}

/**
 * Récupérer une commande appartenant à l'utilisateur connecté.
 */
async function getUserOrderById(userId, orderId) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },

    include: {
      items: true,

      payments: true,
    },
  });

  if (!order) {
    throw createServiceError(
      "Commande introuvable.",
      404,
    );
  }

  return order;
}

/**
 * Annuler une commande.
 */
async function cancelUserOrder(userId, orderId) {
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findFirst({
      where: {
        id: orderId,
        userId,
      },

      include: {
        items: true,
      },
    });

    if (!order) {
      throw createServiceError(
        "Commande introuvable.",
        404,
      );
    }

    const cancellableStatuses = [
      "REQUESTED",
      "APPROVED",
    ];

    if (!cancellableStatuses.includes(order.status)) {
      throw createServiceError(
        "Cette commande ne peut plus être annulée.",
        409,
      );
    }

    if (order.paymentStatus === "PAID") {
      throw createServiceError(
        "Une commande payée doit être remboursée avant son annulation.",
        409,
      );
    }

    /*
     * Restitution du stock.
     */
    for (const item of order.items) {
      if (item.productId) {
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
  createOrder,
  getUserOrders,
  getUserOrderById,
  cancelUserOrder,
};