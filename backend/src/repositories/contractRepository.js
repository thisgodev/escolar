const knex = require("../config/database");

class ContractRepository {
  /**
   * Cria um novo contrato.
   * A 'contractData' já deve conter o tenant_id.
   */
  create(contractData, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("contracts").insert(contractData).returning("*");
  }

  /**
   * Retorna todos os contratos (com nomes de responsável e aluno).
   * Se tenantId for fornecido, filtra por ele.
   */
  getAll(tenantId) {
    const query = knex("contracts as c")
      .join("users as u", "c.guardian_id", "u.id")
      .join("students as s", "c.student_id", "s.id")
      .select("c.*", "u.name as guardian_name", "s.name as student_name");

    if (tenantId) {
      query.where("c.tenant_id", tenantId);
    }

    return query.orderBy("c.created_at", "desc");
  }

  /**
   * Encontra um contrato específico pelo ID.
   * Se tenantId for fornecido, garante que o contrato pertença àquele cliente.
   */
  findById(id, tenantId) {
    const query = knex("contracts").where({ id }).first();

    if (tenantId) {
      query.andWhere({ tenant_id: tenantId });
    }

    return query;
  }
}

module.exports = new ContractRepository();
