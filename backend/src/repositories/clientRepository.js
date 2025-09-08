const knex = require("../config/database");
class ClientRepository {
  create(clientData, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("tenants").insert(clientData).returning("*");
  }
  getAll() {
    return knex("tenants").select("*").orderBy("company_name", "asc");
  }
}
module.exports = new ClientRepository();
