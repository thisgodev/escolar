const knex = require("../config/database");

class InstallmentRepository {
  /**
   * Cria múltiplas parcelas de uma vez.
   * O 'tenant_id' já deve estar presente em cada objeto de installmentsData.
   */
  createMany(installmentsData, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("installments").insert(installmentsData);
  }

  /**
   * Encontra todas as parcelas de um contrato, garantindo que pertençam ao tenant.
   */
  findByContractId(contract_id, tenantId) {
    const query = knex("installments")
      .where({ contract_id })
      .orderBy("installment_number", "asc");

    // Se tenantId for fornecido, filtra por ele. Essencial para segurança.
    if (tenantId) {
      query.andWhere({ tenant_id: tenantId });
    }

    return query;
  }

  /**
   * Encontra uma única parcela pelo ID, para verificação.
   */
  findById(id, tenantId) {
    const query = knex("installments").where({ id }).first();
    if (tenantId) {
      query.andWhere({ tenant_id: tenantId });
    }
    return query;
  }

  /**
   * Atualiza uma parcela específica, garantindo que ela pertença ao tenant.
   */
  update(id, tenantId, data, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("installments")
      .where({ id, tenant_id: tenantId })
      .update(data)
      .returning("*");
  }

  /**
   * Atualiza múltiplas parcelas em lote, garantindo que pertençam ao tenant.
   */
  updateMany(ids, tenantId, data, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("installments")
      .whereIn("id", ids)
      .andWhere({ tenant_id: tenantId })
      .update(data);
  }
}

module.exports = new InstallmentRepository();
