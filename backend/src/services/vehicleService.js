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

  async getVehicleById(id, user) {
    const tenantId = user.tenant_id;
    const vehicle = await vehicleRepository.findById(id, tenantId);
    if (!vehicle) throw new Error("Veículo não encontrado ou acesso negado.");
    return vehicle;
  }
  async updateVehicle(id, data, user) {
    const tenantId = user.tenant_id;
    const [updatedVehicle] = await vehicleRepository.update(id, tenantId, data);
    if (!updatedVehicle) throw new Error("Falha ao atualizar o veículo.");
    return updatedVehicle;
  }
  async deleteVehicle(id, user) {
    const tenantId = user.tenant_id;
    const [updatedVehicle] = await vehicleRepository.delete(id, tenantId);
    if (!updatedVehicle) throw new Error("Falha ao atualizar o veículo.");
    return updatedVehicle;
  }
}

module.exports = new VehicleService();
