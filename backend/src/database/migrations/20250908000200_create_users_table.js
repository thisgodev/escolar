// /backend/src/database/migrations/TIMESTAMP_create_users_table.js
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table
      .enum("role", ["admin", "guardian", "driver", "monitor"])
      .notNullable();
    table.string("phone");
    table.string("cpf").unique();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
