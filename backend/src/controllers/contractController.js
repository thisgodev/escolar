const contractService = require("../services/contractService");

class ContractController {
  async create(req, res) {
    try {
      const contract = await contractService.createContractAndInstallments(
        req.body
      );
      res.status(201).json(contract);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const contracts = await contractService.getAllContracts();
      res.status(200).json(contracts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const contractDetails = await contractService.getContractDetails(id);
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
        req.body
      );
      res.status(200).json(payment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async undoPayment(req, res) {
    try {
      const { installmentId } = req.params;
      const installment = await contractService.undoPayment(installmentId);
      res.status(200).json(installment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async registerBulkPayment(req, res) {
    try {
      const { installmentIds, paymentDate } = req.body;
      const result = await contractService.registerBulkPayment(
        installmentIds,
        paymentDate
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ContractController();
