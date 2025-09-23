const inviteService = require("../services/inviteService");

class InviteController {
  async create(req, res) {
    try {
      const { email, role } = req.body;
      const invite = await inviteService.createInvite(email, role, req.user);
      res.status(201).json(invite);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getByToken(req, res) {
    try {
      const { token } = req.params;
      const invite = await inviteService.getInviteByToken(token);
      if (!invite) {
        return res
          .status(404)
          .json({ message: "Convite inválido, usado ou expirado." });
      }
      res.status(200).json(invite);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new InviteController();
