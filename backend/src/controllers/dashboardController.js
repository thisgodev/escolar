const dashboardService = require("../services/dashboardService");

class DashboardController {
  /**
   * Lida com a requisição para buscar o resumo de dados do dashboard,
   * adaptando a resposta com base no papel (role) do usuário autenticado.
   */
  async getSummary(req, res) {
    try {
      const { id, role, tenant_id } = req.user;
      let summary;

      if (role === "admin") {
        summary = await dashboardService.getAdminSummary(tenant_id);
      } else if (role === "guardian") {
        summary = await dashboardService.getGuardianSummary(id);
      } else if (role === "driver" || role === "monitor") {
        summary = await dashboardService.getDriverSummary(id);
      } else {
        // Retorna um resumo vazio ou uma mensagem para papéis não esperados.
        summary = {
          message: "Nenhum dado de dashboard disponível para este perfil.",
        };
      }

      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({
        message: "Erro ao buscar dados do dashboard.",
        error: error.message,
      });
    }
  }
}

module.exports = new DashboardController();
