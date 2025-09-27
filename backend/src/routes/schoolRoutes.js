const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// =================================================================
// ROTA PÚBLICA (para o formulário de matrícula)
// =================================================================
// Esta rota NÃO tem o 'authMiddleware'.
// A segurança é feita no service, que exige um 'tenantId' na query.
// Ex: GET /api/schools?tenantId=1
router.get("/", schoolController.getAll);

// =================================================================
// ROTAS PROTEGIDAS (exigem que o usuário esteja logado)
// =================================================================

// Apenas administradores logados podem criar novas escolas
// Ex: POST /api/schools
router.post("/", authMiddleware, adminMiddleware, schoolController.create);

// Qualquer usuário logado pode buscar os detalhes de uma escola
// Ex: GET /api/schools/1
router.get("/:id", authMiddleware, schoolController.getById);

// Apenas administradores logados podem atualizar uma escola
// Ex: PATCH /api/schools/1
router.patch("/:id", authMiddleware, adminMiddleware, schoolController.update);

// Futuramente:
// router.delete('/:id', authMiddleware, adminMiddleware, schoolController.delete);

module.exports = router;
