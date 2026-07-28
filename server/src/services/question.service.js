const prisma = require("../lib/prisma");

async function getQuestions() {
  return prisma.question.findMany({
    orderBy: {
      position: "asc",
    },
  });
}

async function getQuestionById(id) {
  return prisma.question.findUnique({
    where: { id },
  });
}

async function createQuestion(data) {
  return prisma.question.create({
    data,
  });
}

async function updateQuestion(id, data) {
  return prisma.question.update({
    where: { id },
    data,
  });
}

async function deleteQuestion(id) {
  return prisma.question.delete({
    where: { id },
  });
}

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};