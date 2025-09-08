const knex = require("../config/database");
const contractRepository = require("../repositories/contractRepository");
const installmentRepository = require("../repositories/installmentRepository");
const { addMonths } = require("date-fns");

class ContractService {
  async createContractAndInstallments(contractData) {
    if (
      !contractData.guardian_id ||
      !contractData.student_id ||
      !contractData.installments_count ||
      !contractData.installment_value ||
      !contractData.first_due_date
    ) {
      throw new Error("Dados do contrato incompletos.");
    }

    return knex.transaction(async (trx) => {
      const [newContract] = await contractRepository.create(contractData, trx);
      const installments = [];
      for (let i = 0; i < newContract.installments_count; i++) {
        installments.push({
          contract_id: newContract.id,
          installment_number: i + 1,
          due_date: addMonths(new Date(newContract.first_due_date), i),
          base_value: newContract.installment_value,
          status: "pending",
        });
      }
      await installmentRepository.createMany(installments, trx);
      return newContract;
    });
  }

  async getAllContracts() {
    return contractRepository.getAll();
  }

  async getContractDetails(contractId) {
    const contract = await knex("contracts as c")
      .join("users as u", "c.guardian_id", "u.id")
      .join("students as s", "c.student_id", "s.id")
      .where("c.id", contractId)
      .select("c.*", "u.name as guardian_name", "s.name as student_name")
      .first();
    if (!contract) throw new Error("Contrato não encontrado");
    const installments = await installmentRepository.findByContractId(
      contractId
    );
    return { ...contract, installments };
  }

  async registerPayment(installmentId, paymentData) {
    if (!paymentData.paid_value || !paymentData.payment_date) {
      throw new Error("Valor pago e data do pagamento são obrigatórios.");
    }
    const updateData = { ...paymentData, status: "paid" };
    const [updatedInstallment] = await installmentRepository.update(
      installmentId,
      updateData
    );
    return updatedInstallment;
  }

  async undoPayment(installmentId) {
    const updateData = {
      status: "pending",
      paid_value: null,
      payment_date: null,
    };
    const [undoneInstallment] = await installmentRepository.update(
      installmentId,
      updateData
    );
    if (!undoneInstallment)
      throw new Error("Parcela não encontrada para reverter.");
    return undoneInstallment;
  }

  async registerBulkPayment(installmentIds, paymentDate) {
    if (!installmentIds || installmentIds.length === 0) {
      throw new Error("Nenhuma parcela selecionada para pagamento.");
    }
    return knex.transaction(async (trx) => {
      const updatedRows = await trx("installments")
        .whereIn("id", installmentIds)
        .andWhere("status", "pending")
        .update({
          status: "paid",
          payment_date: paymentDate,
          paid_value: knex.raw("base_value"),
        });
      return { count: updatedRows };
    });
  }
}

module.exports = new ContractService();
