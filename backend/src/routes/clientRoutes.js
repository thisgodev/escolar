const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const authMiddleware = require("../middlewares/authMiddleware");
const superAdminMiddleware = require("../middlewares/superAdminMiddleware");

// Protege todas as rotas deste arquivo para serem acessíveis apenas pelo Super Admin
router.use(authMiddleware, superAdminMiddleware);

router.get("/", clientController.getAll);
router.post("/", clientController.create);

module.exports = router;
