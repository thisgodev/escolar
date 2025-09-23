const knex = require("../config/database");
const contractRepository = require("../repositories/contractRepository");
const installmentRepository = require("../repositories/installmentRepository");
const { addMonths } = require("date-fns");
const { getInstallmentStatus } = require("../utils/statusHelper");

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
      !contractData.installments_count ||
      !(contractData.installments_count > 0) ||
      !contractData.installment_value ||
      !(contractData.installment_value > 0) ||
      !contractData.first_due_date
    ) {
      throw new Error(
        "Todos os campos são obrigatórios e os valores devem ser maiores que zero."
      );
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
  async getAllContracts(user, statusFilter) {
    const tenantId = user.role === "super_admin" ? null : user.tenant_id;

    // 1. Busca a lista base de contratos
    const contracts = await contractRepository.getAll(tenantId);

    // Se não houver contratos, retorne um array vazio
    if (contracts.length === 0) {
      return [];
    }

    const contractIds = contracts.map((c) => c.id);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const firstDayOfCurrentMonth = new Date(currentYear, currentMonth - 1, 1);

    // 2. Busca todas as parcelas relevantes para os contratos encontrados
    const allInstallments = await knex("installments")
      .where({ tenant_id: tenantId })
      .whereIn("contract_id", contractIds)
      .orderBy("due_date", "asc");

    // 3. Processa os dados para cada contrato
    const contractsWithStatus = contracts.map((contract) => {
      const relatedInstallments = allInstallments.filter(
        (i) => i.contract_id === contract.id
      );

      // Encontra a parcela do mês atual
      const currentMonthInstallment = relatedInstallments.find((i) => {
        const dueDate = new Date(i.due_date);
        return (
          dueDate.getMonth() + 1 === currentMonth &&
          dueDate.getFullYear() === currentYear
        );
      });

      // Verifica se há parcelas vencidas de meses anteriores
      const hasPastDueInstallments = relatedInstallments.some((i) => {
        const dueDate = new Date(i.due_date);
        return dueDate < firstDayOfCurrentMonth && i.status === "pending";
      });

      return {
        ...contract,
        // O status principal do contrato é o status da parcela deste mês
        current_month_status: currentMonthInstallment
          ? getInstallmentStatus(currentMonthInstallment)
          : "sem_parcela",
        has_past_due_installments: hasPastDueInstallments,
      };
    });

    // 4. Aplica o filtro (se houver) com base no novo status calculado
    if (statusFilter) {
      return contractsWithStatus.filter((c) => {
        if (statusFilter === "pending") {
          return (
            ["pendente", "vencido"].includes(c.current_month_status) ||
            c.has_past_due_installments
          );
        }
        if (statusFilter === "paid") {
          return c.current_month_status === "pago";
        }
        return true;
      });
    }

    return contractsWithStatus;
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

    const installmentsWithStatus = installments.map((inst) => ({
      ...inst,
      status: getInstallmentStatus(inst),
    }));

    // Precisamos buscar os nomes aqui também, pois findById não faz join
    const guardian = await knex("users")
      .where({ id: contract.guardian_id })
      .first();
    const student = await knex("students")
      .where({ id: contract.student_id })
      .first();

    return {
      ...contract,
      installments: installmentsWithStatus,
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
      tenantId,
      updateData
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
      tenantId,
      updateData
    );

    if (!undoneInstallment) {
      throw new Error("Falha ao reverter a parcela após a atualização.");
    }

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
