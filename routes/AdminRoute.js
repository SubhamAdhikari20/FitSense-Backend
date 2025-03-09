const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const upload = require('./../middleware/UploadImage');
const { loginAdmin, forgotPassword, uploadImage, updateAdminProfileDetails, deleteAdmin, deleteTrainerByAdmin, getAllTrainersByAdmin, getAdminByEmail } = require("./../controllers/AdminController")

router.post("/login_admin", loginAdmin);
router.post("/forgot_password", forgotPassword);

router.put("/profile_picture", upload.single("profilePicture"), uploadImage);
router.put("/update_admin_profile_details/:id", authGuard, updateAdminProfileDetails);

router.delete("/delete_admin", authGuard, deleteAdmin);
router.delete("/delete_trainer_by_admin/:id", authGuard, deleteTrainerByAdmin);

router.get("/get_all_trainers", authGuard, getAllTrainersByAdmin);
router.get("/view_admin_by_email", getAdminByEmail);


// Export the route
module.exports = router;