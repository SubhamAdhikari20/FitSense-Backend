const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const upload = require('./../middleware/UploadImage');
const { registerUser, loginUser, forgotPassword, uploadImage, updateProfileDetails, deleteUser, getUserByEmail, getAllTrainersByUser, getUserDashboard } = require("./../controllers/UserController")

router.post("/register_user", registerUser);
router.post("/login_user", loginUser);
router.post("/forgot_password", forgotPassword);

router.put("/profile_picture", upload.single("profilePicture"), uploadImage);
router.put("/update_profile_details/:id", authGuard, updateProfileDetails);

router.delete("/delete_user", authGuard, deleteUser);

router.get("/get_all_trainers", authGuard, getAllTrainersByUser);
router.get("/view_user_by_email", getUserByEmail);
router.get("/dashboard", authGuard, getUserDashboard);


// Export the route
module.exports = router;
