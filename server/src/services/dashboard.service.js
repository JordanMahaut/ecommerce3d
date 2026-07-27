const prisma = require("../lib/prisma");

async function getDashboardStats() {
  const [
    products,
    categories,
    orders,
    quotes,
    users,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.quote.count(),
    prisma.user.count(),
  ]);

  return {
    products,
    categories,
    orders,
    quotes,
    users,
    questions: 0,
    revenue: 0,
  };
}

module.exports = {
  getDashboardStats,
};