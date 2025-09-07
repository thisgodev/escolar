const knex = require("../config/database");

class RouteRepository {
  /**
   * Cria uma nova rota no banco de dados.
   * @param {object} routeData - Os dados da rota.
   * @returns {Promise<object[]>} Um array com a rota criada.
   */
  create(routeData) {
    return knex("routes").insert(routeData).returning("*");
  }

  /**
   * Retorna todas as rotas com o nome da escola associada.
   * @returns {Promise<object[]>} Uma lista de rotas.
   */
  getAll() {
    return knex("routes")
      .join("schools", "routes.school_id", "schools.id")
      .select(
        "routes.id",
        "routes.name",
        "routes.description",
        "schools.name as school_name"
      );
  }

  /**
   * Encontra uma rota pelo seu ID.
   * @param {number} id - O ID da rota.
   * @returns {Promise<object|undefined>} A rota encontrada ou undefined.
   */
  findById(id) {
    return knex("routes").where({ id }).first();
  }
}

module.exports = new RouteRepository();
