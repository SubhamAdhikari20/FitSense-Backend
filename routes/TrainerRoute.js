const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const upload = require('./../middleware/UploadImage');
const { registerTrainer, loginTrainer, forgotPassword, uploadImage, deleteTrainer, updateTrainerProfileDetails, getTrainerByEmail, getAllTrainers } = require("./../controllers/TrainerController");

router.post("/register_trainer", registerTrainer);
router.post("/login_trainer", loginTrainer);
router.post("/forgot_password", forgotPassword);

router.put("/profile_picture", upload.single("profilePicture"), uploadImage);
router.put("/update_profile_details/:id", authGuard, updateTrainerProfileDetails);

router.delete("/delete_trainer", authGuard, deleteTrainer);

router.get("/get_all_workouts", authGuard, getAllTrainers);
router.get("/view_trainer_by_email", getTrainerByEmail);


// Export the route
module.exports = router;