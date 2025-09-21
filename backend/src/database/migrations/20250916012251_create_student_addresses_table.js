exports.up = function (knex) {
  return knex.schema.createTable("student_addresses", (table) => {
    table.increments("id").primary();
    table
      .integer("student_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("students")
      .onDelete("CASCADE");
    table
      .integer("address_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("addresses")
      .onDelete("CASCADE");
    table.string("label").notNullable(); // Ex: 'Casa da Mãe', 'Casa do Pai', 'Judô'
    table.unique(["student_id", "address_id"]);
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable("student_addresses");
};
