const routeService = require("../services/routeService");

class RouteController {
  async create(req, res) {
    try {
      const route = await routeService.createRoute(req.body, req.user);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const routes = await routeService.getAllRoutes(req.user);
      res.status(200).json(routes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const route = await routeService.getRouteById(id, req.user);
      res.status(200).json(route);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async addStudent(req, res) {
    try {
      const { id } = req.params;

      const logisticData = req.body;

      const result = await routeService.addStudentToRoute(
        id,
        logisticData,
        req.user
      );

      res.status(201).json(result);
    } catch (error) {
      console.error("Erro em addStudent Controller:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async addStaff(req, res) {
    try {
      const { id } = req.params;
      const { user_id, assignment_type } = req.body;
      const result = await routeService.addStaffToRoute(
        id,
        user_id,
        assignment_type,
        req.user
      );
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getChecklist(req, res) {
    try {
      const { id } = req.params;
      const { date } = req.query;
      if (!date)
        return res.status(400).json({ message: "A data é obrigatória." });
      const checklist = await routeService.getChecklistForDate(
        id,
        date,
        req.user
      );
      res.status(200).json(checklist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async check(req, res) {
    try {
      const checkData = { ...req.body };
      // O req.user aqui é do motorista/monitor
      const result = await routeService.performCheck(checkData, req.user);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new RouteController();
