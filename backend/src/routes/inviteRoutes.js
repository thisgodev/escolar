const express = require("express");
const router = express.Router();
const inviteController = require("../controllers/inviteController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Rota para o admin criar um convite
router.post("/", authMiddleware, adminMiddleware, inviteController.create);

// Rota pública para a página de registro verificar um token
router.get("/:token", inviteController.getByToken);

module.exports = router;
