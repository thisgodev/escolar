const knex = require("../config/database");

class InviteRepository {
  create(inviteData) {
    return knex("invites").insert(inviteData).returning("*");
  }

  findByToken(token) {
    return knex("invites").where({ token }).first();
  }

  markAsUsed(id, trx) {
    const queryBuilder = trx || knex;
    return queryBuilder("invites").where({ id }).update({ is_used: true });
  }
}

module.exports = new InviteRepository();
