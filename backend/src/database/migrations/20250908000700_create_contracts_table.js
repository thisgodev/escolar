// /backend/src/database/migrations/TIMESTAMP_create_contracts_table.js
exports.up = function (knex) {
  return knex.schema.createTable("contracts", (table) => {
    table.increments("id").primary();
    table
      .integer("guardian_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("student_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("students")
      .onDelete("CASCADE");
    table.integer("installments_count").notNullable();
    table.decimal("installment_value", 10, 2).notNullable();
    table.date("first_due_date").notNullable();
    table.integer("due_day").notNullable();
    table
      .enum("status", ["active", "finished", "cancelled"])
      .notNullable()
      .defaultTo("active");
    table.text("notes");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("contracts");
};
