const express = require("express");

const addressController = require("../controllers/address.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", addressController.getAddresses);
router.get("/:id", addressController.getAddressById);
router.post("/", addressController.createAddress);
router.put("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);

router.patch(
  "/:id/default",
  addressController.setDefaultAddress,
);

module.exports = router;