async function generateOrderReference(
  transaction,
  date = new Date(),
) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const prefix = `CMD-${year}${month}${day}`;

  const count = await transaction.order.count({
    where: {
      reference: {
        startsWith: prefix,
      },
    },
  });

  const sequence = String(count + 1).padStart(6, "0");

  return `${prefix}-${sequence}`;
}

module.exports = {
  generateOrderReference,
};