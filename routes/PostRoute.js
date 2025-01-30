const express = require("express");

const router = express.Router();

// Import PostController
const postController = require("../controllers/PostController");

router.get("/view_post", postController.getPost);

router.post("/create_post", postController.createPost);

// Export the route
module.exports = router;