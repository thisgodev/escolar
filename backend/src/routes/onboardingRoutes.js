const express = require("express");
const router = express.Router();
const onboardingController = require("../controllers/onboardingController");

// Este endpoint é PÚBLICO, pois é acessado por um link.
// A segurança é garantida pela necessidade de um tenantId válido na URL.
// Ex: POST /api/onboarding/matricula/1
router.post("/matricula/:tenantId", onboardingController.matricula);

module.exports = router;
