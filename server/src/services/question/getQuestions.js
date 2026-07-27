const prisma = require("../../lib/prisma");

async function getQuestions() {
  return prisma.quoteQuestion.findMany({
    orderBy: {
      position: "asc",
    },
  });
}

module.exports = {
  getQuestions,
};