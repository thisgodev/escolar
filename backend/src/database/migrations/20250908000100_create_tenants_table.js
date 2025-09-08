// /backend/src/database/migrations/..._create_tenants_table.js
exports.up = function (knex) {
  return knex.schema.createTable("tenants", (table) => {
    table.increments("id").primary();
    table.string("company_name").notNullable();
    table.string("cpf_cnpj").notNullable().unique(); // ESSENCIAL
    table.string("contact_email").notNullable().unique(); // Email principal do cliente
    table.string("contact_phone"); // Telefone principal do cliente
    table
      .integer("main_address_id")
      .unsigned()
      .references("id")
      .inTable("addresses")
      .onDelete("SET NULL");
    table
      .enum("status", ["active", "inactive", "suspended"])
      .notNullable()
      .defaultTo("active");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tenants");
};
