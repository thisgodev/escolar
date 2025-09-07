const userService = require("../services/userService");

class UserController {
  /**
   * Lida com a requisição para buscar a lista de equipe (motoristas e monitores).
   */
  async getStaff(req, res) {
    try {
      const staff = await userService.getAvailableStaff();
      res.status(200).json(staff);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar a equipe.", error: error.message });
    }
  }

  /**
   * Lida com a requisição para buscar a lista de responsáveis (guardians).
   */
  async getGuardians(req, res) {
    try {
      const guardians = await userService.getGuardians();
      res.status(200).json(guardians);
    } catch (error) {
      res.status(500).json({
        message: "Erro ao buscar os responsáveis.",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
