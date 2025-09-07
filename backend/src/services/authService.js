const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return newUser;
  }
  // ... Lógica de login, geração de token JWT
}

module.exports = new AuthService();
