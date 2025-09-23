const crypto = require("crypto");
const inviteRepository = require("../repositories/inviteRepository");

class InviteService {
  async createInvite(email, role, user) {
    const tenantId = user.tenant_id;
    if (user.role !== "admin" || !tenantId) {
      throw new Error("Apenas administradores podem enviar convites.");
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7); // Convite expira em 7 dias

    const [newInvite] = await inviteRepository.create({
      tenant_id: tenantId,
      email,
      role,
      token,
      expires_at,
    });

    // TODO: Implementar lógica de envio de email
    console.log(
      `Convite criado para ${email}. Link: http://localhost:5173/register?token=${token}`
    );

    return newInvite;
  }

  async getInviteByToken(token) {
    const invite = await inviteRepository.findByToken(token);
    if (!invite || invite.is_used || new Date(invite.expires_at) < new Date()) {
      return null; // Retorna nulo se o convite for inválido, usado ou expirado
    }
    return invite;
  }
}

module.exports = new InviteService();
