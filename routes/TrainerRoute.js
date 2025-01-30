const express = require("express");
const router = express.Router();

// Import TrainerController
const trainerController = require("../controllers/TrainerController");
// const uploadImage = require("./middleware/UploadImage");


router.post("/register_trainer", trainerController.registerTrainer);
router.post("/login_trainer", trainerController.loginTrainer);
// router.get("/view_trainer_by_id", trainerController.getTrainerById);
// router.get("/view_all_trainers", trainerController.getAllTrainers);
// router.put("/update_trainer", trainerController.updateTrainer);
// router.delete("/delete_trainer", trainerController.deleteTrainer);

// Export the route
module.exports = router;