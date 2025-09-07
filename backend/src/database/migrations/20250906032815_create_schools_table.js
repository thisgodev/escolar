// /backend/src/database/migrations/TIMESTAMP_create_schools_table.js
exports.up = function (knex) {
  return knex.schema.createTable("schools", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("cnpj").unique();
    table
      .integer("address_id")
      .unsigned()
      .references("id")
      .inTable("addresses")
      .onDelete("SET NULL");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("schools");
};
