const prisma = require("../../lib/prisma");

/**
 * Génère une référence de devis.
 * Exemple : DEV-20260727-0001
 */
async function generateQuoteReference(transaction = prisma) {
  const today = new Date();

  const date =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  const count = await transaction.quote.count({
    where: {
      createdAt: {
        gte: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ),
      },
    },
  });

  const number = String(count + 1).padStart(4, "0");

  return `DEV-${date}-${number}`;
}

module.exports = {
  generateQuoteReference,
};