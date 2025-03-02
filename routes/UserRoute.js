const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const upload = require('./../middleware/UploadImage');
const { registerUser, loginUser, forgotPassword, uploadImage, deleteUser, getUserByEmail, getUserDashboard } = require("./../controllers/UserController")

router.post("/register_user", registerUser);
router.post("/login_user", loginUser);
router.post("/forgot_password", forgotPassword);
router.post("/profile_picture", upload.single("profilePicture"), uploadImage);

router.delete("/delete_user", authGuard, deleteUser);
router.get("/view_user_by_email", getUserByEmail);
router.get("/dashboard", authGuard, getUserDashboard);


// Export the route
module.exports = router;
