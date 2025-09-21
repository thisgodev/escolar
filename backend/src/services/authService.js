const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

class AuthService {
  /**
   * Registra um novo usuário no sistema.
   * @param {object} userData - Dados do usuário (name, email, password, etc.).
   * @returns {Promise<object>} O novo usuário criado (sem a senha).
   */
  async register(userData) {
    console.log("AuthService - register chamado");
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error("Nome, email e senha são obrigatórios.");
    }
    console.log("Registrando usuário com dados:", userData);

    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Este email já está em uso.");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [newUser] = await userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "guardian",
      cpf: userData.cpf,
      phone: userData.phone,
      tenant_id: 1,
    });

    delete newUser.password;
    return newUser;
  }

  /**
   * Autentica um usuário e retorna um token JWT.
   * @param {string} email - O email do usuário.
   * @param {string} password - A senha do usuário.
   * @returns {Promise<{user: object, token: string}>} O objeto do usuário e o token.
   */
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Credenciais inválidas.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas.");
    }

    const tokenPayload = {
      id: user.id,
      role: user.role,
      name: user.name,
      tenant_id: user.tenant_id,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete user.password;
    return { user, token };
  }
}

module.exports = new AuthService();
