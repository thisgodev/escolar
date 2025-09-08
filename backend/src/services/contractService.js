const knex = require("../config/database");
const contractRepository = require("../repositories/contractRepository");
const installmentRepository = require("../repositories/installmentRepository");
const { addMonths } = require("date-fns");

class ContractService {
  /**
   * Cria um contrato e suas parcelas, associando-os ao tenant do usuário criador (admin).
   */
  async createContractAndInstallments(contractData, user) {
    if (user.role !== "admin" || !user.tenant_id) {
      throw new Error(
        "Apenas administradores de clientes podem criar contratos."
      );
    }
    if (
      !contractData.guardian_id ||
      !contractData.student_id ||
      !contractData.installments_count
    ) {
      throw new Error("Dados do contrato incompletos.");
    }

    const contractDataWithTenant = {
      ...contractData,
      tenant_id: user.tenant_id,
    };

    return knex.transaction(async (trx) => {
      const [newContract] = await contractRepository.create(
        contractDataWithTenant,
        trx
      );

      const installments = [];
      for (let i = 0; i < newContract.installments_count; i++) {
        installments.push({
          contract_id: newContract.id,
          tenant_id: user.tenant_id, // Adiciona tenant_id também às parcelas
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

  /**
   * Busca todos os contratos, aplicando o filtro de tenant com base no perfil.
   */
  async getAllContracts(user) {
    const tenantId = user.role === "super_admin" ? null : user.tenant_id;
    return contractRepository.getAll(tenantId);
  }

  /**
   * Busca os detalhes de um contrato, garantindo o acesso.
   */
  async getContractDetails(contractId, user) {
    const tenantId = user.role === "super_admin" ? null : user.tenant_id;
    const contract = await contractRepository.findById(contractId, tenantId);
    if (!contract) throw new Error("Contrato não encontrado ou acesso negado.");

    // A busca de parcelas também deve ser segura
    const installments = await installmentRepository.findByContractId(
      contractId,
      tenantId
    );

    // Precisamos buscar os nomes aqui também, pois findById não faz join
    const guardian = await knex("users")
      .where({ id: contract.guardian_id })
      .first();
    const student = await knex("students")
      .where({ id: contract.student_id })
      .first();

    return {
      ...contract,
      installments,
      guardian_name: guardian.name,
      student_name: student.name,
    };
  }

  async registerPayment(installmentId, paymentData, user) {
    const tenantId = user.tenant_id;
    if (user.role !== "admin" || !tenantId) {
      throw new Error("Ação não permitida.");
    }

    const installment = await installmentRepository.findById(
      installmentId,
      tenantId
    );
    if (!installment) {
      throw new Error("Parcela não encontrada ou acesso negado.");
    }

    if (!paymentData.paid_value || !paymentData.payment_date) {
      throw new Error("Valor pago e data do pagamento são obrigatórios.");
    }

    const updateData = { ...paymentData, status: "paid" };
    const [updatedInstallment] = await installmentRepository.update(
      installmentId,
      updateData,
      tenantId
    );
    return updatedInstallment;
  }

  async undoPayment(installmentId, user) {
    const tenantId = user.tenant_id;
    if (user.role !== "admin" || !tenantId) {
      throw new Error("Ação não permitida.");
    }

    const installment = await installmentRepository.findById(
      installmentId,
      tenantId
    );
    if (!installment) {
      throw new Error("Parcela não encontrada ou acesso negado.");
    }

    const updateData = {
      status: "pending",
      paid_value: null,
      payment_date: null,
    };
    const [undoneInstallment] = await installmentRepository.update(
      installmentId,
      updateData,
      tenantId
    );

    return undoneInstallment;
  }

  async registerBulkPayment(installmentIds, paymentDate, user) {
    const tenantId = user.tenant_id;
    if (user.role !== "admin" || !tenantId) {
      throw new Error("Ação não permitida.");
    }
    if (!installmentIds || installmentIds.length === 0) {
      throw new Error("Nenhuma parcela selecionada para pagamento.");
    }
    const updateData = {
      status: "paid",
      payment_date: paymentDate,
      paid_value: knex.raw("base_value"),
    };

    const updatedRows = await installmentRepository.updateMany(
      installmentIds,
      tenantId,
      updateData
    );

    return { count: updatedRows };
  }
}

module.exports = new ContractService();
