const userService = require("../services/userService");

class UserController {
  async getStaff(req, res) {
    try {
      const staff = await userService.getAvailableStaff(req.user);
      res.status(200).json(staff);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar a equipe.", error: error.message });
    }
  }

  async getGuardians(req, res) {
    try {
      const guardians = await userService.getGuardians(req.user);
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
