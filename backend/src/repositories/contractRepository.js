const knex = require("../config/database");

class ContractRepository {
  /**
   * Cria um novo contrato no banco de dados.
   * @param {object} contractData - Os dados do contrato.
   * @param {import('knex').Transaction} [trx] - O objeto de transação, se houver.
   * @returns {Promise<object[]>} Um array com o contrato criado.
   */
  create(contractData, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("contracts").insert(contractData).returning("*");
  }

  /**
   * Retorna todos os contratos com os nomes do responsável e do aluno.
   * @returns {Promise<object[]>} Uma lista de contratos.
   */
  getAll() {
    return knex("contracts as c")
      .join("users as u", "c.guardian_id", "u.id")
      .join("students as s", "c.student_id", "s.id")
      .select("c.*", "u.name as guardian_name", "s.name as student_name");
  }

  /**
   * Encontra um contrato pelo seu ID.
   * @param {number} id - O ID do contrato.
   * @returns {Promise<object|undefined>} O contrato encontrado ou undefined.
   */
  findById(id) {
    return knex("contracts").where({ id }).first();
  }
}

module.exports = new ContractRepository();
