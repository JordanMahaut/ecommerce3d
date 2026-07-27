const { generateQuoteReference } = require("./generateQuoteReference");

/**
 * Crée un devis lié à une demande de commande.
 */
async function createQuote(transaction, data) {
  const reference = await generateQuoteReference(transaction);

  return transaction.quote.create({
    data: {
      reference,

      name: data.name,
      email: data.email,
      phone: data.phone,

      message: data.customerNote || "",

      serviceType: "3D_PRINT",

      status: "PENDING",

      subtotal: data.subtotal,
      shippingCost: data.shippingCost,
      discount: data.discount,
      total: data.total,

      userId: data.userId,
    },
  });
}

module.exports = {
  createQuote,
};