exports.up = function (knex) {
  return knex.schema.createTable("vehicles", (table) => {
    table.increments("id").primary();

    table
      .integer("tenant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE");

    table.string("placa").notNullable();
    table.string("modelo");
    table.integer("ano");
    table.integer("capacidade");
    table
      .enum("status", ["ativo", "inativo", "em_manutencao"])
      .notNullable()
      .defaultTo("ativo");

    table.timestamps(true, true);

    // Garante que a placa seja única para cada cliente, mas não globalmente
    table.unique(["tenant_id", "placa"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("vehicles");
};
