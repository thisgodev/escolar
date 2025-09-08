// /backend/src/database/migrations/TIMESTAMP_create_routes_students_table.js
exports.up = function (knex) {
  return knex.schema.createTable("routes_students", (table) => {
    table.increments("id").primary();
    table
      .integer("route_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("routes")
      .onDelete("CASCADE");
    table
      .integer("student_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("students")
      .onDelete("CASCADE");
    table
      .enum("trip_type", ["ida_e_volta", "apenas_ida", "apenas_volta"])
      .notNullable();
    table.integer("pickup_order");
    table.integer("dropoff_order");
    table.text("notes");
    table.unique(["route_id", "student_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("routes_students");
};
