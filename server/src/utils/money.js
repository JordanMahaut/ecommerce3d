const { Prisma } = require("@prisma/client");

function toDecimal(value) {
  return new Prisma.Decimal(value);
}

function calculateSubtotal(items) {
  return items.reduce((total, item) => {
    return total.plus(
      toDecimal(item.price).times(item.quantity),
    );
  }, toDecimal("0.00"));
}

function calculateTotal({
  subtotal,
  shippingCost = "0.00",
  discount = "0.00",
}) {
  return toDecimal(subtotal)
    .plus(toDecimal(shippingCost))
    .minus(toDecimal(discount));
}

module.exports = {
  toDecimal,
  calculateSubtotal,
  calculateTotal,
};