const express = require("express");
const router = express.Router();

// Import UserController
const userController = require("../controllers/UserController");
// const uploadImage = require("./middleware/UploadImage");


router.post("/register_user", userController.registerUser);
router.post("/login_user", userController.loginUser);
router.get("/view_user_by_id", userController.getUserById);
router.get("/view_all_users", userController.getAllUsers);
router.put("/update_user", userController.updateUser);
router.delete("/delete_user", userController.deleteUser);



// Export the route
module.exports = router;