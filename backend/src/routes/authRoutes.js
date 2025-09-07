const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rota para registrar um novo usuário
// Ex: POST http://localhost:3001/api/auth/register
router.post("/register", authController.register);

// Rota para fazer login e obter um token JWT
// Ex: POST http://localhost:3001/api/auth/login
router.post("/login", authController.login);

module.exports = router;
