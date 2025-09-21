exports.up = function (knex) {
  return knex.schema.alterTable("routes_students", (table) => {
    // Remove a coluna antiga
    table.dropColumn("trip_type");

    // Adiciona as novas colunas
    table
      .integer("pickup_address_id")
      .unsigned()
      .references("id")
      .inTable("addresses")
      .nullable(); // Ponto de coleta
    table
      .integer("dropoff_address_id")
      .unsigned()
      .references("id")
      .inTable("addresses")
      .nullable(); // Ponto de entrega
    table.jsonb("weekdays").nullable(); // Armazenará os dias, ex: ['seg', 'qua', 'sex']
  });
};
exports.down = function (knex) {
  return knex.schema.alterTable("routes_students", (table) => {
    table.enum("trip_type", ["ida_e_volta", "apenas_ida", "apenas_volta"]);
    table.dropColumn("pickup_address_id");
    table.dropColumn("dropoff_address_id");
    table.dropColumn("weekdays");
  });
};
