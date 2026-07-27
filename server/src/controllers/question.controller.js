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

module.exports = {
  getAllQuestions,
  createNewQuestion,
  updateExistingQuestion,
  deleteExistingQuestion,
  reorderExistingQuestions,
};