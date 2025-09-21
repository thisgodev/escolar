exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();

    // Role como enum
    table.enu("role", ["admin", "guardian", "driver", "monitor"]).notNullable();

    table.string("phone");

    // cpf como nullable, mas ainda único
    table.string("cpf").nullable().unique();

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
