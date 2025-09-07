const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Requer autenticação para todas as rotas
router.use(authMiddleware);

// --- Rotas de Gerenciamento de Rotas (Admin) ---
router.post("/", adminMiddleware, routeController.create);
router.post("/:id/students", adminMiddleware, routeController.addStudent);
router.post("/:id/staff", adminMiddleware, routeController.addStaff);

// --- Rotas de Consulta (Acessíveis a mais perfis) ---
router.get("/", routeController.getAll);
router.get("/:id", routeController.getById);

// --- Rotas de Checklist (Operacional) ---
router.get("/:id/checklist", routeController.getChecklist);
router.post("/checklist", routeController.check);

module.exports = router;
