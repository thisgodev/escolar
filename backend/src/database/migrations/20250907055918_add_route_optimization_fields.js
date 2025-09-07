// /backend/src/database/migrations/TIMESTAMP_add_route_optimization_fields.js
exports.up = function (knex) {
  return knex.schema
    .table("routes", (table) => {
      table.integer("estimated_duration_seconds");
      table.integer("estimated_distance_meters");
      table.text("polyline");
      table.jsonb("directions_response");
    })
    .then(() => {
      return knex.schema.table("routes_students", (table) => {
        // Estes campos podem ser usados para armazenar horários de chegada em cada ponto
        // ou outras informações da otimização.
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .table("routes", (table) => {
      table.dropColumn("estimated_duration_seconds");
      table.dropColumn("estimated_distance_meters");
      table.dropColumn("polyline");
      table.dropColumn("directions_response");
    })
    .then(() => {
      return knex.schema.table("routes_students", (table) => {
        return knex.schema;
      });
    });
};
