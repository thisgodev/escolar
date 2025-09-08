// /backend/src/database/migrations/TIMESTAMP_create_invoices_table.js
exports.up = function (knex) {
  return knex.schema.createTable("invoices", (table) => {
    table.increments("id").primary();
    table
      .integer("installment_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("installments")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .enum("status", ["pending", "processing", "issued", "error", "cancelled"])
      .notNullable()
      .defaultTo("pending");
    table.decimal("value", 10, 2).notNullable();
    table.string("service_description").notNullable();
    table.datetime("issued_at");
    table.string("external_id");
    table.string("authorization_code");
    table.string("city");
    table.text("pdf_url");
    table.jsonb("api_response");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("invoices");
};
