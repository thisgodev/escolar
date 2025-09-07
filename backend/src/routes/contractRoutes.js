const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// A gestão de contratos é exclusiva para administradores
router.use(authMiddleware, adminMiddleware);

// --- Contratos ---
router.post("/", contractController.create);
router.get("/", contractController.getAll);
router.get("/:id", contractController.getById);

// --- Parcelas (Installments) ---
router.post("/installments/bulk-pay", contractController.registerBulkPayment);
router.patch(
  "/installments/:installmentId/pay",
  contractController.registerPayment
);
router.patch(
  "/installments/:installmentId/undo",
  contractController.undoPayment
);

module.exports = router;
