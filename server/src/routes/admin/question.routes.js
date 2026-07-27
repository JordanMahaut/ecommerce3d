const express = require("express");

const router = express.Router();

const {
  getAllQuestions,
  createNewQuestion,
} = require("../../controllers/question.controller");

const auth = require("../../middleware/auth.middleware");
const admin = require("../../middleware/admin.middleware");

router.use(auth);
router.use(admin);

router.get("/", getAllQuestions);
router.post("/", createNewQuestion);

module.exports = router;