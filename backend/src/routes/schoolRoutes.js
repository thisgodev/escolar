const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Requer que o usuário esteja logado para todas as rotas
router.use(authMiddleware);

// Qualquer usuário logado pode listar as escolas
// Ex: GET http://localhost:3001/api/schools
router.get("/", schoolController.getAll);

// Apenas administradores podem criar novas escolas
// Ex: POST http://localhost:3001/api/schools
router.post("/", adminMiddleware, schoolController.create);

// Futuramente, as rotas de update e delete também usarão o adminMiddleware
// router.put('/:id', adminMiddleware, schoolController.update);
// router.delete('/:id', adminMiddleware, schoolController.delete);

module.exports = router;
