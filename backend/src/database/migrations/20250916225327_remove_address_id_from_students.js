// /backend/src/database/migrations/..._remove_address_id_from_students.js

exports.up = function (knex) {
  return knex.schema.alterTable("students", (table) => {
    table.dropForeign("address_id");
    table.dropColumn("address_id");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("students", (table) => {
    table
      .integer("address_id")
      .unsigned()
      .references("id")
      .inTable("addresses")
      .nullable();
  });
};
