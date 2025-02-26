const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const upload = require('./../middleware/UploadImage');
const { loginAdmin, forgotPassword, uploadImage, deleteAdminByEmail, getAdminByEmail } = require("./../controllers/AdminController")

router.post("/login_admin", loginAdmin);
router.post("/forgot_password", forgotPassword);
router.post("/profile_picture", upload.single("profilePicture"), uploadImage);

router.delete("/delete_admin", authGuard, deleteAdminByEmail);
router.get("/view_admin_by_email", getAdminByEmail);


// Export the route
module.exports = router;