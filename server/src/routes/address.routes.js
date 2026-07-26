import { Router } from "express";

import auth from "../middleware/auth.middleware.js";

import {
  indexAddresses,
  storeAddress,
  editAddress,
  destroyAddress,
  makeDefaultAddress,
} from "../controllers/address.controller.js";

const router = Router();

router.use(auth);

router.get("/", indexAddresses);
router.post("/", storeAddress);
router.put("/:id", editAddress);
router.delete("/:id", destroyAddress);
router.patch("/:id/default", makeDefaultAddress);

export default router;