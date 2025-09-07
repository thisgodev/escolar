const knex = require("../config/database");
const schoolRepository = require("../repositories/schoolRepository");

class SchoolService {
  /**
   * Cria uma escola e seu endereço em uma única transação.
   * @param {object} schoolData - Dados da escola.
   * @param {object} addressData - Dados do endereço.
   * @returns {Promise<object>} A nova escola criada.
   */
  async createSchoolWithAddress(schoolData, addressData) {
    return knex.transaction(async (trx) => {
      const [newAddress] = await trx("addresses")
        .insert(addressData)
        .returning("id");
      const finalSchoolData = { ...schoolData, address_id: newAddress.id };
      const [newSchool] = await schoolRepository.create(finalSchoolData, trx);
      return newSchool;
    });
  }

  /**
   * Busca todas as escolas.
   * @returns {Promise<object[]>}
   */
  async getAllSchools() {
    return schoolRepository.getAll();
  }
}

module.exports = new SchoolService();
