const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const { registerUser, loginUser, forgotPassword, getUserByTd, getUserDashboard } = require("./../controllers/UserController")

router.post("/register_user", registerUser);
router.post("/login_user", loginUser);
router.post("/forgot_password", forgotPassword);
router.get("/dashboard", authGuard, getUserDashboard);

// router.get("/view_user_by_id", authGuard, getUserByTd);
// router.get("/view_all_users", userController.getAllUsers);
// router.put("/update_user", userController.updateUser);
// router.delete("/delete_user", userController.deleteUser);



// Export the route
module.exports = router;
