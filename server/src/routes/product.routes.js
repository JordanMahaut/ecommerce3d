const express = require("express");

const {
  listProducts,
  showProduct,
  storeProduct,
  editProduct,
  destroyProduct,
} = require("../controllers/product.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const uploadProductImage = require("../middleware/upload.middleware");

const router = express.Router();

// Routes publiques
router.get("/", listProducts);
router.get("/:slug", showProduct);

// Routes réservées aux administrateurs
router.post(
  "/",
  auth,
  admin,
  uploadProductImage.single("image"),
  storeProduct,
);
router.put(
  "/:id",
  auth,
  admin,
  uploadProductImage.single("image"),
  editProduct,
);
router.delete("/:id", auth, admin, destroyProduct);

module.exports = router;