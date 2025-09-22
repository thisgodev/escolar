const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Todas as rotas de alunos requerem autenticação, então aplicamos o middleware globalmente aqui.
router.use(authMiddleware);

// Rota para um responsável (guardian) criar um novo aluno para si
// Ex: POST http://localhost:3001/api/students
router.post("/", studentController.create);

// Rota para um responsável (guardian) buscar seus próprios alunos
// Ex: GET http://localhost:3001/api/students
router.get("/", studentController.getByGuardian);

// Rota para um administrador buscar TODOS os alunos do sistema
// Ex: GET http://localhost:3001/api/students/all
router.get("/all", adminMiddleware, studentController.getAll);
router.get("/addable", adminMiddleware, studentController.getAddable);

router.get("/:id", studentController.getById); // Rota para buscar um aluno

router.get("/:id/addresses", adminMiddleware, studentController.getAddresses);
router.patch("/:id", studentController.update); // Rota para atualizar um aluno

module.exports = router;
