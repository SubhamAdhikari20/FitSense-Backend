const userModel = require("./../model/UserModel");

const getUser = async(req, res) => {
    try {
        const users = await userModel.findAll();
        res.status(200).json(users);
        console.log("Retrieve all users");
        
    } 
    catch (error) {
        res.status(500).josn({error: "Failed to retrive user data"})
    }
}

const createUser = async(req, res) => {
    try {
        const {username, password} = req.body;
        const newUser = await userModel.create(username, password);
        res.status(200).json(newUser);
        console.log("New user created");
        
    } 
    catch (error) {
        res.status(500).json({error: "Failed to create a user"});
    }
}

module.exports = {getUser, createUser};