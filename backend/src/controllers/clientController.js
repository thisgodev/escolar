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
      const { clientData, adminData, address } = req.body;
      const result = await clientService.createClientWithAdmin(
        clientData,
        adminData,
        address
      );
      console.log("Created client and admin:", result);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating client with admin:", error);
      res.status(400).json({ message: error.message });
    }
  }
}
module.exports = new ClientController();
