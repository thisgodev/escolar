exports.up = function (knex) {
  return knex.schema.alterTable("contracts", (table) => {
    table.text("signature_data"); // 'text' é ideal para armazenar a imagem base64 da assinatura
  });
};
exports.down = function (knex) {
  return knex.schema.alterTable("contracts", (table) => {
    table.dropColumn("signature_data");
  });
};
