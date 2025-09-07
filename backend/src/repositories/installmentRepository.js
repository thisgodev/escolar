const knex = require("../config/database");

class InstallmentRepository {
  /**
   * Cria múltiplas parcelas de uma vez (bulk insert).
   * @param {object[]} installmentsData - Um array com os dados das parcelas.
   * @param {import('knex').Transaction} [trx] - O objeto de transação, se houver.
   * @returns {Promise<void>}
   */
  createMany(installmentsData, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("installments").insert(installmentsData);
  }

  /**
   * Encontra todas as parcelas de um contrato específico.
   * @param {number} contract_id - O ID do contrato.
   * @returns {Promise<object[]>} Uma lista de parcelas.
   */
  findByContractId(contract_id) {
    return knex("installments")
      .where({ contract_id })
      .orderBy("installment_number", "asc");
  }

  /**
   * Atualiza uma parcela específica pelo seu ID.
   * @param {number} id - O ID da parcela.
   * @param {object} data - Os dados a serem atualizados.
   * @param {import('knex').Transaction} [trx] - O objeto de transação, se houver.
   * @returns {Promise<object[]>} Um array com a parcela atualizada.
   */
  update(id, data, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("installments")
      .where({ id })
      .update(data)
      .returning("*");
  }
}

module.exports = new InstallmentRepository();
