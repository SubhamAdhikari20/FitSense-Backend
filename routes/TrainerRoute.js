const express = require("express");

const router = express.Router();

// Import UserController
const trainerController = require("../controllers/TrainerController");

router.get("/view_trainer", trainerController.getTrainer);

router.post("/create_trainer", trainerController.createTrainer);

// Export the route
module.exports = router;