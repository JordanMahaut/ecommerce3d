const prisma = require("../lib/prisma");

const {
  createOrder: createOrderService,
  getOrders,
  getOrder,
  updateStatus,
} = require("../services/order");

/**
 * Créer une commande
 * POST /api/orders
 */
async function createOrder(req, res, next) {
  try {
    const order = await createOrderService(req.user.id, req.body);

    return res.status(201).json({
      message: "Commande créée avec succès.",
      order,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupérer les commandes du client connecté
 * GET /api/orders/my-orders
 */
async function getMyOrders(req, res, next) {
  try {
    const orders = await getOrders(req.user.id);

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupérer une commande du client connecté
 * GET /api/orders/my-orders/:id
 */
async function getMyOrderById(req, res, next) {
  try {
    const order = await getOrder(req.user.id, req.params.id);

    return res.status(200).json({
      order,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupérer toutes les commandes côté administration
 * GET /api/orders/admin
 */
async function getAdminOrders(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100,
    );

    const skip = (page - 1) * limit;

    const where = {};

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      where.paymentStatus = req.query.paymentStatus;
    }

    if (req.query.search) {
      const search = req.query.search.trim();

      if (search) {
        where.OR = [
          {
            reference: {
              contains: search,
            },
          },
          {
            customerEmail: {
              contains: search,
            },
          },
          {
            shippingFirstname: {
              contains: search,
            },
          },
          {
            shippingLastname: {
              contains: search,
            },
          },
        ];
      }
    }

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip,
        take: limit,

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

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.order.count({
        where,
      }),
    ]);

    return res.status(200).json({
      orders,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupérer une commande côté administration
 * GET /api/orders/admin/:id
 */
async function getAdminOrderById(req, res, next) {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      const error = new Error("Identifiant de commande invalide.");
      error.statusCode = 400;

      throw error;
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },

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
    });

    if (!order) {
      const error = new Error("Commande introuvable.");
      error.statusCode = 404;

      throw error;
    }

    return res.status(200).json({
      order,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Modifier le statut d'une commande côté administration
 * PATCH /api/orders/admin/:id/status
 */
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!status) {
      const error = new Error(
        "Le nouveau statut de la commande est obligatoire.",
      );

      error.statusCode = 400;

      throw error;
    }

    const order = await updateStatus(req.params.id, status);

    return res.status(200).json({
      message: "Statut de la commande mis à jour.",
      order,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
};