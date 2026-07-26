const { Prisma } = require("@prisma/client");

const SHIPPING_COSTS = {
  COLISSIMO: new Prisma.Decimal("6.90"),
  MONDIAL_RELAY: new Prisma.Decimal("4.90"),
  CHRONOPOST: new Prisma.Decimal("12.90"),
  PICKUP: new Prisma.Decimal("0.00"),
};

const FREE_SHIPPING_THRESHOLD = new Prisma.Decimal("80.00");

function calculateTotals(
  subtotal,
  shippingMethod,
  discount = new Prisma.Decimal("0.00")
) {
  let shippingCost =
    SHIPPING_COSTS[shippingMethod] ??
    new Prisma.Decimal("0.00");

  if (
    shippingMethod !== "PICKUP" &&
    subtotal.greaterThanOrEqualTo(FREE_SHIPPING_THRESHOLD)
  ) {
    shippingCost = new Prisma.Decimal("0.00");
  }

  const total = subtotal
    .plus(shippingCost)
    .minus(discount);

  return {
    subtotal,
    shippingCost,
    discount,
    total,
  };
}

module.exports = {
  calculateTotals,
  SHIPPING_COSTS,
  FREE_SHIPPING_THRESHOLD,
};