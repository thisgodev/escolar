const contractService = require("../services/contractService");

class ContractController {
  async create(req, res) {
    try {
      const contract = await contractService.createContractAndInstallments(
        req.body,
        req.user
      );
      res.status(201).json(contract);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const { status } = req.query;
      const contracts = await contractService.getAllContracts(req.user, status);
      res.status(200).json(contracts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const contractDetails = await contractService.getContractDetails(
        id,
        req.user
      );
      res.status(200).json(contractDetails);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async registerPayment(req, res) {
    try {
      const { installmentId } = req.params;
      const payment = await contractService.registerPayment(
        installmentId,
        req.body,
        req.user
      );
      res.status(200).json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // undoPayment e registerBulkPayment seguirão o mesmo padrão, passando req.user
  async undoPayment(req, res) {
    try {
      const { installmentId } = req.params;
      console.log(
        "[Controller] Iniciando undoPayment para installmentId:",
        installmentId
      );
      console.log("[Controller] Usuário da requisição:", req.user);
      const installment = await contractService.undoPayment(
        installmentId,
        req.user
      );
      res.status(200).json(installment);
    } catch (error) {
      console.error("[Controller] ERRO:", error.message);
      res.status(400).json({ message: error.message });
    }
  }

  async registerBulkPayment(req, res) {
    try {
      const { installmentIds, paymentDate } = req.body;
      const result = await contractService.registerBulkPayment(
        installmentIds,
        paymentDate,
        req.user
      ); // Adicionar user
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ContractController();
