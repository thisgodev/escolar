const knex = require("../config/database");
const clientRepository = require("../repositories/clientRepository");
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");

class ClientService {
  async getAllClients() {
    return clientRepository.getAll();
  }

  async createClientWithAdmin(clientData, adminData) {
    if (
      !clientData.company_name ||
      !adminData.name ||
      !adminData.email ||
      !adminData.password
    ) {
      throw new Error(
        "Dados do cliente ou do administrador inicial estão incompletos."
      );
    }

    return knex.transaction(async (trx) => {
      // 1. Cria o novo cliente (tenant)
      const [newClient] = await clientRepository.create(clientData, trx);

      // 2. Prepara e cria o primeiro usuário admin para este cliente
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      const adminPayload = {
        ...adminData,
        password: hashedPassword,
        role: "admin",
        tenant_id: newClient.id, // Associa o admin ao novo tenant
      };

      const [newAdmin] = await userRepository.create(adminPayload, trx);

      // Retorna os dados do cliente e do admin criado
      return { client: newClient, admin: newAdmin };
    });
  }
}
module.exports = new ClientService();
