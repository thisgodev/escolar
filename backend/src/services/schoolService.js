const knex = require("../config/database");
const schoolRepository = require("../repositories/schoolRepository");

class SchoolService {
  /**
   * Cria uma escola e seu endereço, associando-os ao tenant do usuário criador.
   * @param {object} schoolData - Dados da escola (sem tenant_id).
   * @param {object} addressData - Dados do endereço (sem tenant_id).
   * @param {object} creatingUser - O objeto do usuário autenticado (do token).
   * @returns {Promise<object>}
   */
  async createSchoolWithAddress(schoolData, addressData, creatingUser) {
    // Apenas admins de um tenant podem criar escolas
    if (creatingUser.role !== "admin" || !creatingUser.tenant_id) {
      throw new Error(
        "Apenas administradores de clientes podem criar escolas."
      );
    }

    const tenantId = creatingUser.tenant_id;

    return knex.transaction(async (trx) => {
      // Adiciona o tenant_id aos dados antes de inserir
      const addressDataWithTenant = { ...addressData, tenant_id: tenantId };
      const schoolDataWithTenant = { ...schoolData, tenant_id: tenantId };

      const [newAddress] = await trx("addresses")
        .insert(addressDataWithTenant)
        .returning("id");
      const finalSchoolData = {
        ...schoolDataWithTenant,
        address_id: newAddress.id,
      };
      const [newSchool] = await schoolRepository.create(finalSchoolData, trx);

      return newSchool;
    });
  }

  /**
   * Busca todas as escolas.
   * Se for Super Admin, busca todas.
   * Se for um usuário de um tenant, busca apenas as escolas daquele tenant.
   * @param {object} user - O objeto do usuário autenticado.
   * @returns {Promise<object[]>}
   */
  async getAllSchools(user) {
    // Se for Super Admin, tenantId será null, e o repositório buscará tudo.
    // Caso contrário, usa o tenant_id do usuário.
    const tenantId = user.role === "super_admin" ? null : user.tenant_id;

    return schoolRepository.getAll(tenantId);
  }
}

module.exports = new SchoolService();
