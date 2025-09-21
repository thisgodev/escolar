exports.up = function (knex) {
  return knex.schema.table("routes_staff", (table) => {
    // Adiciona a coluna permitindo nulos para passar em bancos com dados
    table
      .integer("tenant_id")
      .unsigned()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.table("routes_staff", (table) => {
    table.dropForeign("tenant_id");
    table.dropColumn("tenant_id");
  });
};
