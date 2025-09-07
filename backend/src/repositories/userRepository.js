const knex = require("../config/database");

class UserRepository {
  /**
   * Encontra um usuário pelo seu email.
   * @param {string} email - O email do usuário.
   * @returns {Promise<object|undefined>} O usuário encontrado ou undefined.
   */
  findByEmail(email) {
    return knex("users").where({ email }).first();
  }

  /**
   * Encontra um usuário pelo seu ID.
   * @param {number} id - O ID do usuário.
   * @returns {Promise<object|undefined>} O usuário encontrado ou undefined.
   */
  findById(id) {
    return knex("users").where({ id }).first();
  }

  /**
   * Cria um novo usuário no banco de dados.
   * @param {object} user - Os dados do usuário a serem criados.
   * @returns {Promise<object[]>} Um array com o usuário criado.
   */
  create(user) {
    return knex("users").insert(user).returning("*");
  }

  /**
   * Encontra todos os usuários com o papel de 'driver' ou 'monitor'.
   * @returns {Promise<object[]>} Uma lista de membros da equipe.
   */
  findStaff() {
    return knex("users")
      .whereIn("role", ["driver", "monitor"])
      .select("id", "name", "role");
  }

  /**
   * Encontra todos os usuários com o papel de 'guardian' (responsável).
   * @returns {Promise<object[]>} Uma lista de responsáveis.
   */
  findGuardians() {
    return knex("users").where({ role: "guardian" }).select("id", "name");
  }
}

module.exports = new UserRepository();
