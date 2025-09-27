const onboardingService = require("../services/onboardingService");

class OnboardingController {
  async matricula(req, res) {
    try {
      // A segurança será garantida pelo tenant_id na URL
      const { tenantId } = req.params;
      const formData = req.body;

      if (!tenantId) {
        return res
          .status(400)
          .json({ message: "Identificação do cliente ausente." });
      }

      const result = await onboardingService.processMatricula(
        formData,
        Number(tenantId)
      );
      res.status(201).json(result);
    } catch (error) {
      console.error("Erro no processo de matrícula:", error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new OnboardingController();
