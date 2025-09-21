const authService = require("../services/authService");

class AuthController {
  /**
   * Lida com a requisição de registro de um novo usuário.
   */
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      console.log("RETORNO SERVICE:", user);
      res.status(201).json(user);
    } catch (error) {
      // Retorna 400 (Bad Request) para erros de validação, como email já em uso.
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Lida com a requisição de login.
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      res.status(200).json(data);
    } catch (error) {
      // Retorna 401 (Unauthorized) para credenciais inválidas.
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
