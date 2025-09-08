const knex = require("../config/database");

class VehicleRepository {
  /**
   * Cria um novo veículo.
   * A 'vehicleData' já deve conter o tenant_id.
   */
  create(vehicleData) {
    return knex("vehicles").insert(vehicleData).returning("*");
  }

  /**
   * Retorna todos os veículos.
   * Se tenantId for fornecido, filtra por ele.
   */
  getAll(tenantId) {
    const query = knex("vehicles").select("*");
    if (tenantId) {
      query.where({ tenant_id: tenantId });
    }
    return query.orderBy("modelo", "asc");
  }

  // Métodos para Update e Delete que serão necessários
  findById(id, tenantId) {
    const query = knex("vehicles").where({ id }).first();
    if (tenantId) {
      query.andWhere({ tenant_id: tenantId });
    }
    return query;
  }

  update(id, tenantId, updateData) {
    return knex("vehicles")
      .where({ id, tenant_id: tenantId })
      .update(updateData)
      .returning("*");
  }

  delete(id, tenantId) {
    return knex("vehicles").where({ id, tenant_id: tenantId }).del();
  }
}

module.exports = new VehicleRepository();
