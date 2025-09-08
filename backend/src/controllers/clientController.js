const clientService = require("../services/clientService");
class ClientController {
  async getAll(req, res) {
    try {
      const clients = await clientService.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { clientData, adminData } = req.body;
      const result = await clientService.createClientWithAdmin(
        clientData,
        adminData
      );
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
module.exports = new ClientController();
