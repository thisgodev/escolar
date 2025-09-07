const knex = require("../config/database");

class StudentRepository {
  /**
   * Cria um novo aluno no banco de dados.
   * @param {object} studentData - Os dados do aluno.
   * @param {import('knex').Transaction} [trx] - O objeto de transação, se houver.
   * @returns {Promise<object[]>} Um array com o aluno criado.
   */
  create(studentData, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("students").insert(studentData).returning("*");
  }

  /**
   * Encontra todos os alunos de um responsável específico.
   * @param {number} guardian_id - O ID do responsável.
   * @returns {Promise<object[]>} Uma lista de alunos.
   */
  findByGuardianId(guardian_id) {
    return knex("students").where({ guardian_id });
  }

  /**
   * Encontra todos os alunos do sistema.
   * @returns {Promise<object[]>} Uma lista com o ID e nome de todos os alunos.
   */
  findAll() {
    return knex("students").select("id", "name");
  }
}

module.exports = new StudentRepository();
