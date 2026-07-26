const { Prisma } = require("@prisma/client");

const SHIPPING_COSTS = {
  COLISSIMO: new Prisma.Decimal("6.90"),
  MONDIAL_RELAY: new Prisma.Decimal("4.90"),
  CHRONOPOST: new Prisma.Decimal("12.90"),
  PICKUP: new Prisma.Decimal("0.00"),
};

function getShippingCost(shippingMethod, subtotal) {
  const freeShippingThreshold = new Prisma.Decimal("80.00");

  if (
    shippingMethod !== "PICKUP" &&
    subtotal.greaterThanOrEqualTo(freeShippingThreshold)
  ) {
    return new Prisma.Decimal("0.00");
  }

  return (
    SHIPPING_COSTS[shippingMethod] ??
    new Prisma.Decimal("0.00")
  );
}

module.exports = {
  getShippingCost,
  SHIPPING_COSTS,
};