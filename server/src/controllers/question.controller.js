const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} = require("../services/question");

const asyncHandler = require("../utils/asyncHandler");

const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await getQuestions();

  return res.status(200).json({
    success: true,
    questions,
  });
});

const createNewQuestion = asyncHandler(async (req, res) => {
  const question = await createQuestion(req.body);

  return res.status(201).json({
    success: true,
    message: "Question créée avec succès.",
    question,
  });
});

const updateExistingQuestion = asyncHandler(async (req, res) => {
  const question = await updateQuestion(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Question modifiée avec succès.",
    question,
  });
});

const deleteExistingQuestion = asyncHandler(async (req, res) => {
  const question = await deleteQuestion(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Question supprimée avec succès.",
    question,
  });
});

const reorderExistingQuestions = asyncHandler(async (req, res) => {
  const questions = await reorderQuestions(req.body.questionIds);

  return res.status(200).json({
    success: true,
    message: "Ordre des questions mis à jour avec succès.",
    questions,
  });
});

async function getQuestionById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Identifiant de question invalide.",
      });
    }

    const question = await questionService.getQuestionById(id);

    if (!question) {
      return res.status(404).json({
        message: "Question introuvable.",
      });
    }

    return res.status(200).json(question);
  } catch (error) {
    console.error("Erreur récupération question :", error);

    return res.status(500).json({
      message: "Impossible de récupérer la question.",
    });
  }
}

module.exports = {
  getAllQuestions,
  createNewQuestion,
  getQuestionById,
  updateExistingQuestion,
  deleteExistingQuestion,
  reorderExistingQuestions,
};