const prisma = require("../../lib/prisma");

async function reorderQuestions(questionIds) {
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    throw new Error("La liste des questions est invalide.");
  }

  await prisma.$transaction(
    questionIds.map((id, index) =>
      prisma.quoteQuestion.update({
        where: {
          id: Number(id),
        },
        data: {
          position: index,
        },
      })
    )
  );

  return prisma.quoteQuestion.findMany({
    orderBy: {
      position: "asc",
    },
  });
}

module.exports = {
  reorderQuestions,
};