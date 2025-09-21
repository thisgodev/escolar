exports.up = function (knex) {
  return knex.schema.table("routes_students", (table) => {
    // Adiciona a coluna tenant_id, tornando-a não nula e uma chave estrangeira
    table
      .integer("tenant_id")
      .unsigned()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.table("routes_students", (table) => {
    table.dropForeign("tenant_id");
    table.dropColumn("tenant_id");
  });
};
