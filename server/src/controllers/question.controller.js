const {
  getQuestions,
  getQuestionById: findQuestionById,
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

const getQuestionById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de question invalide.",
    });
  }

  const question = await findQuestionById(id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: "Question introuvable.",
    });
  }

  return res.status(200).json({
    success: true,
    question,
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
  const { questionIds } = req.body;

  if (
    !Array.isArray(questionIds) ||
    questionIds.length === 0 ||
    questionIds.some((id) => !Number.isInteger(Number(id)))
  ) {
    return res.status(400).json({
      success: false,
      message: "La liste questionIds est invalide.",
    });
  }

  const questions = await reorderQuestions(
    questionIds.map(Number),
  );

  return res.status(200).json({
    success: true,
    message: "Ordre des questions mis à jour avec succès.",
    questions,
  });
});

module.exports = {
  getAllQuestions,
  getQuestionById,
  createNewQuestion,
  updateExistingQuestion,
  deleteExistingQuestion,
  reorderExistingQuestions,
};