const postModel = require("../models/PostModel");

const getPost = async(req, res) => {
    try {
        const posts = await postModel.findAll();
        res.status(200).json(posts);
        console.log("Retrieve all posts");
        
    } 
    catch (error) {
        res.status(500).josn({error: "Failed to retrive post data"})
    }
}

const createPost = async(req, res) => {
    try {
        const {postDesc, postImage} = req.body;
        const newPost = await postModel.create(postDesc, postImage);
        res.status(200).json(newPost);
        console.log("New post added");
        
    } 
    catch (error) {
        res.status(500).json({error: "Failed to add a post"});
    }
}

module.exports = {getPost, createPost};