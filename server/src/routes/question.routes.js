const express = require("express");

const router = express.Router();

const {
  getAllQuestions,
  getQuestionById,
  createNewQuestion,
  updateExistingQuestion,
  deleteExistingQuestion,
  reorderExistingQuestions,
} = require("../controllers/question.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.use(auth);
router.use(admin);

router.get("/", getAllQuestions);

router.patch("/reorder", reorderExistingQuestions);

router.post("/", createNewQuestion);

router.get("/:id", getQuestionById);
router.put("/:id", updateExistingQuestion);
router.delete("/:id", deleteExistingQuestion);

module.exports = router;