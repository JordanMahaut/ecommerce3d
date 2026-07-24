const express = require("express");

const auth = require("../middleware/auth.middleware");

const {
  registerUser,
  loginUser,
  getMe,
  verifyEmailUser,
  forgotPasswordUser,
  resetPasswordUser,
} = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmailUser);
router.post("/forgot-password", forgotPasswordUser);
router.post("/reset-password", resetPasswordUser);

router.get("/me", auth, getMe);

module.exports = router;