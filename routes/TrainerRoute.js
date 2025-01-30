const express = require("express");
const router = express.Router();

// Import TrainerController
const trainerController = require("../controllers/TrainerController");
// const uploadImage = require("./middleware/UploadImage");


router.post("/register_trainer", trainerController.registerTrainer);
// router.post("/login_trainer", trainerController.loginTrainer);
// router.get("/view_trainerbyid", trainerController.getTrainerByid);
// router.put("/:id", trainerController.updateTrainer);
// router.delete("/:id", trainerController.deleteTrainer);

// Export the route
module.exports = router;