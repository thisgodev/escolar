const vehicleRepository = require("../repositories/vehicleRepository");

class VehicleService {
  /**
   * Cria um novo veículo, associando-o ao tenant do usuário criador.
   */
  async createVehicle(vehicleData, user) {
    if (user.role !== "admin" || !user.tenant_id) {
      throw new Error(
        "Apenas administradores de clientes podem cadastrar veículos."
      );
    }
    const vehicleDataWithTenant = { ...vehicleData, tenant_id: user.tenant_id };
    const [newVehicle] = await vehicleRepository.create(vehicleDataWithTenant);
    return newVehicle;
  }

  /**
   * Busca todos os veículos, aplicando o filtro de tenant.
   */
  async getAllVehicles(user) {
    const tenantId = user.role === "super_admin" ? null : user.tenant_id;
    return vehicleRepository.getAll(tenantId);
  }
}

module.exports = new VehicleService();
