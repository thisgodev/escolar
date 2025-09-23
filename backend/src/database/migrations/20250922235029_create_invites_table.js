exports.up = function (knex) {
  return knex.schema.createTable("invites", (table) => {
    table.increments("id").primary();
    table
      .integer("tenant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE");
    table.string("email").notNullable();
    table.string("token").notNullable().unique();
    table.enum("role", ["guardian", "driver", "monitor"]).notNullable();
    table.boolean("is_used").defaultTo(false);
    table.timestamp("expires_at");
    table.timestamps(true, true);
    table.unique(["tenant_id", "email", "role"]);
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable("invites");
};
