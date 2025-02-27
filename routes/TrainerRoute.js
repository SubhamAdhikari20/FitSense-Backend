const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const upload = require('./../middleware/UploadImage');
const { registerTrainer, loginTrainer, forgotPassword, uploadImage, deleteTrainerByEmail, getTrainerByEmail, getAllTrainers } = require("./../controllers/TrainerController")

router.post("/register_trainer", registerTrainer);
router.post("/login_trainer", loginTrainer);
router.post("/forgot_password", forgotPassword);
router.post("/profile_picture", upload.single("profilePicture"), uploadImage);

router.delete("/delete_trainer", authGuard, deleteTrainerByEmail);
router.get("/view_trainer_by_email", getTrainerByEmail);
router.get("/view_all_trainers", getAllTrainers);


// Export the route
module.exports = router;