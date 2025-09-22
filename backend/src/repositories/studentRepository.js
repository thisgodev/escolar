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
  findByGuardianId(guardian_id, tenantId) {
    return knex("students").where({ guardian_id, tenant_id: tenantId });
  }

  /**
   * Encontra todos os alunos do sistema.
   * @returns {Promise<object[]>} Uma lista com o ID e nome de todos os alunos.
   */
  findAll(tenantId) {
    const query = knex("students").select("id", "name");
    if (tenantId) {
      query.where({ tenant_id: tenantId });
    }
    return query;
  }

  /**
   * Encontra um aluno específico pelo ID, respeitando o tenant.
   * @param {number} id - O ID do aluno.
   * @param {number|null} tenantId - O ID do tenant.
   * @returns {Promise<object|undefined>} O aluno encontrado ou undefined.
   */
  findById(id, tenantId) {
    const query = knex("students").where({ id }).first();
    if (tenantId) {
      query.andWhere({ tenant_id: tenantId });
    }
    return query;
  }

  findActiveAndUnassigned(tenantId, routeId) {
    // Subquery para encontrar os IDs dos alunos que JÁ estão na rota
    const subquery = knex("routes_students")
      .select("student_id")
      .where("route_id", routeId);

    // Query principal
    return knex("students as s")
      .join("contracts as c", "s.id", "c.student_id")
      .where("s.tenant_id", tenantId)
      .andWhere("c.status", "active") // Filtra por contrato ativo
      .whereNotIn("s.id", subquery) // Exclui os que já estão na rota
      .select("s.id", "s.name")
      .distinct("s.id"); // Garante que cada aluno apareça uma vez
  }

  update(id, tenantId, studentData, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("students")
      .where({ id, tenant_id: tenantId })
      .update(studentData)
      .returning("*");
  }
}

module.exports = new StudentRepository();
