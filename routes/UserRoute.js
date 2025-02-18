const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const { registerUser, loginUser, getUserDashboard } = require("./../controllers/UserController")

router.post("/register_user", registerUser);
router.post("/login_user", loginUser);
// router.get("/view_user_by_id", userController.getUserById);
// router.get("/view_all_users", userController.getAllUsers);
// router.put("/update_user", userController.updateUser);
// router.delete("/delete_user", userController.deleteUser);

router.get("/dashboard", authGuard, getUserDashboard);

// Export the route
module.exports = router;
