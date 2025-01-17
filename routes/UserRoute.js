const express = require("express");

const router = express.Router();

// Import UserController
const userController = require("../controllers/UserController");


router.get("/view_users", userController.getUser);

router.post("/create_users", userController.createUser);

// Export the route
module.exports = router;