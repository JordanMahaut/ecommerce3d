const prisma = require("../../lib/prisma");

async function deleteQuestion(id) {
  const questionId = Number(id);

  if (!Number.isInteger(questionId) || questionId <= 0) {
    throw new Error("L’identifiant de la question est invalide.");
  }

  const existingQuestion = await prisma.quoteQuestion.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!existingQuestion) {
    throw new Error("Question introuvable.");
  }

  const answerCount = await prisma.quoteAnswer.count({
    where: {
      questionId,
    },
  });

  if (answerCount > 0) {
    throw new Error(
      "Cette question possède déjà des réponses et ne peut pas être supprimée. Désactive-la plutôt."
    );
  }

  return prisma.quoteQuestion.delete({
    where: {
      id: questionId,
    },
  });
}

module.exports = {
  deleteQuestion,
};