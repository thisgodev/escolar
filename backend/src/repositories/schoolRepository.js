const knex = require("../config/database");

class SchoolRepository {
  /**
   * Cria uma nova escola.
   * A 'schoolData' já deve conter o tenant_id.
   * @param {object} schoolData - Dados da escola.
   * @param {import('knex').Transaction} [trx] - O objeto de transação.
   * @returns {Promise<object[]>}
   */
  create(schoolData, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("schools").insert(schoolData).returning("*");
  }

  /**
   * Retorna todas as escolas.
   * Se tenantId for fornecido, filtra por ele.
   * Se não, retorna todas as escolas de todos os clientes (para Super Admin).
   * @param {number|null} tenantId - O ID do tenant.
   * @returns {Promise<object[]>}
   */
  getAll(tenantId) {
    const query = knex("schools").select("*").orderBy("name", "asc");

    if (tenantId) {
      query.where({ tenant_id: tenantId });
    }

    return query;
  }

  /**
   * Encontra uma escola específica pelo ID.
   * Se tenantId for fornecido, garante que a escola pertença àquele cliente.
   * @param {number} id - O ID da escola.
   * @param {number|null} tenantId - O ID do tenant.
   * @returns {Promise<object|undefined>}
   */
  findById(id, tenantId) {
    const query = knex("schools").where({ id }).first();

    if (tenantId) {
      query.andWhere({ tenant_id: tenantId });
    }

    return query;
  }

  // Futuramente, os métodos update e delete seguirão o mesmo padrão:
  // update(id, schoolData, tenantId) { ... query.where({ id, tenant_id: tenantId }).update(schoolData) ... }
  // delete(id, tenantId) { ... query.where({ id, tenant_id: tenantId }).del() ... }
}

module.exports = new SchoolRepository();
