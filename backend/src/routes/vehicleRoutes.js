const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const vehicleController = require("../controllers/vehicleController");

router.use(authMiddleware);
router.post("/", vehicleController.create);
router.get("/all", adminMiddleware, vehicleController.getAll);

module.exports = router;
