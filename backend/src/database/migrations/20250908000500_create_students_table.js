// /backend/src/database/migrations/TIMESTAMP_create_students_table.js
exports.up = function (knex) {
  return knex.schema.createTable("students", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.date("birth_date");
    table
      .integer("guardian_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("school_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("schools")
      .onDelete("CASCADE");
    table
      .integer("address_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("addresses")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("students");
};
