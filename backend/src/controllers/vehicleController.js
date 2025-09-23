const vehicleService = require("../services/vehicleService");

class VehicleController {
  async create(req, res) {
    try {
      const vehicle = await vehicleService.createVehicle(req.body, req.user);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const vehicles = await vehicleService.getAllVehicles(req.user);
      res.status(200).json(vehicles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const vehicle = await vehicleService.getVehicleById(
        req.params.id,
        req.user
      );
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const vehicle = await vehicleService.updateVehicle(
        req.params.id,
        req.body,
        req.user
      );
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await vehicleService.deleteVehicle(req.params.id, req.user);
      res.status(204).send(); // 204 No Content
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new VehicleController();
