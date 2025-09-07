const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Aplica os middlewares de autenticação e de admin para todas as rotas deste arquivo
router.use(authMiddleware, adminMiddleware);

// Rota para buscar a lista de equipe (motoristas e monitores)
// Ex: GET http://localhost:3001/api/users/staff
router.get("/staff", userController.getStaff);

// Rota para buscar a lista de responsáveis (guardians)
// Ex: GET http://localhost:3001/api/users/guardians
router.get("/guardians", userController.getGuardians);

module.exports = router;
