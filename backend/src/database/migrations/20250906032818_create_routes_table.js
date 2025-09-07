// /backend/src/database/migrations/TIMESTAMP_create_routes_table.js
exports.up = function (knex) {
  return knex.schema.createTable("routes", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table
      .integer("school_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("schools")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("routes");
};
