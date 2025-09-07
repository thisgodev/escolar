// /backend/src/database/migrations/TIMESTAMP_create_addresses_table.js
exports.up = function (knex) {
  return knex.schema.createTable("addresses", (table) => {
    table.increments("id").primary();
    table.string("cep");
    table.string("logradouro").notNullable();
    table.string("numero");
    table.string("complemento");
    table.string("bairro").notNullable();
    table.string("cidade").notNullable();
    table.string("estado", 2).notNullable();
    table.decimal("latitude", 10, 8);
    table.decimal("longitude", 11, 8);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("addresses");
};
