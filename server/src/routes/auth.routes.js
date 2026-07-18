const express = require("express");

const auth = require("../middleware/auth.middleware")

const { registerUser, loginUser, getMe } = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",  loginUser);
router.get("/me", auth, getMe)

module.exports = router;