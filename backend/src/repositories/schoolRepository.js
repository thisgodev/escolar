const knex = require("../config/database");

class SchoolRepository {
  /**
   * Cria uma nova escola no banco de dados.
   * @param {object} schoolData - Os dados da escola.
   * @param {import('knex').Transaction} [trx] - O objeto de transação, se houver.
   * @returns {Promise<object[]>} Um array com a escola criada.
   */
  create(schoolData, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("schools").insert(schoolData).returning("*");
  }

  /**
   * Retorna todas as escolas cadastradas.
   * @returns {Promise<object[]>} Uma lista de escolas.
   */
  getAll() {
    return knex("schools").select("*").orderBy("name", "asc");
  }

  /**
   * Encontra uma escola pelo seu ID.
   * @param {number} id - O ID da escola.
   * @returns {Promise<object|undefined>} A escola encontrada ou undefined.
   */
  findById(id) {
    return knex("schools").where({ id }).first();
  }
}

module.exports = new SchoolRepository();
