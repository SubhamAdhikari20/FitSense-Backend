const express = require("express");
const router = express.Router();

// Import UserController
const userController = require("../controllers/UserController");
// const uploadImage = require("./middleware/UploadImage");


router.post("/register_user", userController.registerUser);
// router.post("/login_user", userController.loginUser);
// router.get("/view_userbyid", userController.getUserByid);
// router.put("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);



// Export the route
module.exports = router;