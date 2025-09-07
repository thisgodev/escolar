const userRepository = require("../repositories/userRepository");

class UserService {
  /**
   * Busca todos os usuários com papel de 'driver' ou 'monitor'.
   * @returns {Promise<object[]>}
   */
  async getAvailableStaff() {
    return userRepository.findStaff();
  }

  /**
   * Busca todos os usuários com papel de 'guardian'.
   * @returns {Promise<object[]>}
   */
  async getGuardians() {
    return userRepository.findGuardians();
  }
}

module.exports = new UserService();
