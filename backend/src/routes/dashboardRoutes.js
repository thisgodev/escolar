const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

// Apenas usuários autenticados podem ver o dashboard
router.use(authMiddleware);

// Rota única que retorna dados de resumo baseados no perfil do usuário logado
// Ex: GET http://localhost:3001/api/dashboard/summary
router.get("/summary", dashboardController.getSummary);

module.exports = router;
