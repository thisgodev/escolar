// /backend/src/repositories/clientRepository.js
const knex = require("../config/database");
class ClientRepository {
  // O método create agora só precisa receber os dados
  create(clientData) {
    // Ele não precisa saber sobre transações, apenas sobre o Knex
    return knex("tenants").insert(clientData).returning("*");
  }
  getAll() {
    return knex("tenants").select("*").orderBy("company_name", "asc");
  }
}
module.exports = new ClientRepository();
