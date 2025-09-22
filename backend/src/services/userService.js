const userRepository = require("../repositories/userRepository");
const knex = require("../config/database"); // Adicione o knex se ele for usado em outras funções

class UserService {
  /**
   * Busca a equipe disponível (drivers/monitors) para o usuário logado.
   * Filtra pelo tenant_id do usuário.
   * @param {object} user - O objeto do usuário autenticado (do token JWT).
   * @returns {Promise<object[]>}
   */
  async getAvailableStaff(user) {
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }
    const tenantId = user.role === "super_admin" ? null : user.tenant_id;
    return userRepository.findStaff(tenantId);
  }

  /**
   * Busca os responsáveis (guardians) para o usuário logado.
   * Filtra pelo tenant_id do usuário.
   * @param {object} user - O objeto do usuário autenticado (do token JWT).
   * @returns {Promise<object[]>}
   */
  async getGuardians(user) {
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }
    const tenantId = user.role === "super_admin" ? null : user.tenant_id;
    return userRepository.findGuardians(tenantId);
  }
}

module.exports = new UserService();
