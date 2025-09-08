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
}

module.exports = new VehicleController();
