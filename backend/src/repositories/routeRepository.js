const knex = require("../config/database");

class RouteRepository {
  /**
   * Cria uma nova rota.
   * A 'routeData' já deve conter o tenant_id.
   */
  create(routeData) {
    return knex("routes").insert(routeData).returning("*");
  }

  /**
   * Retorna todas as rotas (com o nome da escola).
   * Se tenantId for fornecido, filtra por ele.
   */
  getAll(tenantId) {
    const query = knex("routes")
      .join("schools", "routes.school_id", "schools.id")
      .select(
        "routes.id",
        "routes.name",
        "routes.description",
        "schools.name as school_name"
      );

    if (tenantId) {
      // Como a tabela 'schools' também tem tenant_id, a query já está implicitamente segura.
      // Mas adicionar o filtro na tabela principal é uma boa prática de segurança.
      query.where("routes.tenant_id", tenantId);
    }

    return query.orderBy("routes.name", "asc");
  }

  /**
   * Encontra uma rota específica pelo ID.
   * Se tenantId for fornecido, garante que a rota pertença àquele cliente.
   */
  findById(id, tenantId) {
    const query = knex("routes").where({ id }).first();

    if (tenantId) {
      query.andWhere({ tenant_id: tenantId });
    }

    return query;
  }
}

module.exports = new RouteRepository();
