const knex = require("../config/database");
const clientRepository = require("../repositories/clientRepository");
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");

class ClientService {
  async getAllClients() {
    return clientRepository.getAll();
  }

  /**
   * Cria um novo cliente (tenant), seu primeiro usuário admin e, opcionalmente,
   * seu endereço principal em uma única transação.
   * @param {object} clientData - Dados da empresa (sem endereço).
   * @param {object} adminData - Dados do primeiro administrador.
   * @param {object|null} addressData - Dados do endereço principal.
   * @returns {Promise<object>}
   */
  async createClientWithAdmin(clientData, adminData, addressData) {
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
      let main_address_id = null;

      // 1. Se um endereço foi fornecido, cria-o primeiro.
      //    Ele já deve vir com o tenant_id do super_admin, mas vamos garantir
      //    que o tenant_id do endereço principal seja o do novo tenant.
      if (addressData && addressData.logradouro) {
        const [newAddress] = await trx("addresses")
          .insert(addressData)
          .returning("id");
        main_address_id = newAddress.id;
      }

      // 2. Prepara os dados do cliente com o ID do endereço
      const finalClientData = { ...clientData, main_address_id };
      const [newClient] = await clientRepository.create(finalClientData, trx);

      console.log("Tenant criado dentro da transação:", newClient);

      // Atualiza o tenant_id do endereço que acabamos de criar para o novo tenant
      if (main_address_id) {
        await trx("addresses")
          .where({ id: main_address_id })
          .update({ tenant_id: newClient.id });
      }

      // 3. Prepara e cria o primeiro usuário admin para este cliente
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      const adminPayload = {
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: "admin",
        tenant_id: newClient.id,
        cpf: adminData.cpf || null,
      };
      const [newAdmin] = await userRepository.create(adminPayload, trx);

      console.log("Admin criado dentro da transação:", newAdmin);

      delete newAdmin.password;
      return { client: newClient, admin: newAdmin };
    });
  }
}
module.exports = new ClientService();
