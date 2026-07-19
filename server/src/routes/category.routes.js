const express = require("express");

const {
  indexCategories,
  showCategory,
  storeCategory,
  editCategory,
  destroyCategory,
} = require("../controllers/category.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const router = express.Router();

// Public
router.get("/", indexCategories);
router.get("/:slug", showCategory);

// Admin
router.post("/", auth, admin, storeCategory);
router.put("/:id", auth, admin, editCategory);
router.delete("/:id", auth, admin, destroyCategory);

module.exports = router;