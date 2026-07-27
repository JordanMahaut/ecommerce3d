const express = require("express");

const router = express.Router();

const {
  getAllQuestions,
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
router.post("/", createNewQuestion);
router.put("/:id", updateExistingQuestion);
router.delete("/:id", deleteExistingQuestion);

router.patch("/reorder", reorderExistingQuestions);

module.exports = router;