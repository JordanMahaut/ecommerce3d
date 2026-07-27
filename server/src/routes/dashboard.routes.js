const router = require("express").Router();
const dashboardController = require("../controllers/dashboard.controller");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.get("/", auth, admin, dashboardController.getDashboard);

module.exports = router;