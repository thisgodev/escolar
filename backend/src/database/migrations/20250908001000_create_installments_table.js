// /backend/src/database/migrations/..._create_installments_table.js
exports.up = function (knex) {
  return knex.schema.createTable("installments", (table) => {
    table.increments("id").primary();

    table
      .integer("tenant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE");

    table
      .integer("contract_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("contracts")
      .onDelete("CASCADE");
    table.integer("installment_number").notNullable();
    table.date("due_date").notNullable();
    table.decimal("base_value", 10, 2).notNullable();
    table.decimal("paid_value", 10, 2);
    table.date("payment_date");
    table
      .enum("status", ["pending", "paid", "overdue", "cancelled"])
      .notNullable()
      .defaultTo("pending");
    table.timestamps(true, true);
    table.unique(["contract_id", "installment_number"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("installments");
};
