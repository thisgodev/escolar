// Exemplo para registro de usuário
const authService = require("../services/authService");

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const user = await authService.register({ name, email, password, role });
      res
        .status(201)
        .json({ message: "User registered successfully!", userId: user.id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    // ... Lógica de login
  }
}

module.exports = new AuthController();
