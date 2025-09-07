// /backend/src/database/migrations/TIMESTAMP_create_routes_staff_table.js
exports.up = function (knex) {
  return knex.schema.createTable("routes_staff", (table) => {
    table.increments("id").primary();
    table
      .integer("route_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("routes")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .enum("assignment_type", ["main_driver", "substitute_driver", "monitor"])
      .notNullable();
    table.unique(["route_id", "user_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("routes_staff");
};
