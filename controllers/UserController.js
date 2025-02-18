const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createError } = require("./../error");
const dotenv = require("dotenv");
dotenv.config();


const registerUser = async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;
    // const profilePicture = req.

    // validate username, password 
    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({
            error: "Please, insert details"
        });

    }

    try {
        // Check existing user
        console.log(fullName, email, phoneNumber);
        const checkExistingUser = await userModel.findOne({ where: { email } });
        if (checkExistingUser) {
            return res.status(409).json({ error: "Email already exist!" })
        }

        // Hash the password
        const saltRound = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, saltRound);

        // Create new User
        const newUser = await userModel.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword
        });


        // console.log(newUser)
        res.status(200).json({ message: "User registered successfully!", user: newUser });

    }
    catch (error) {
        // console.log(fullName, email, phoneNumber);
        console.log("Error registering user:", error);
        res.status(200).json({ error: "Something went wrong!" });
    }

};



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // validate username, password 
    if (!email || !password) {
        return res.status(400).json({
            error: "Please, enter email and password"
        });

    }

    try {
        // Check existing user
        const checkExistingUser = await userModel.findOne({ where: { email } });
        if (!checkExistingUser) {
            return res.status(400).json({ error: "User does not exist!" })
        }


        //Verify User
        const isMatch = await bcrypt.compare(password, checkExistingUser.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password!!!" })
        }

        // generate Token
        const token = jwt.sign(
            { id: checkExistingUser.id, email: checkExistingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({ message: "Successfully logged in", token });

    }

    catch (error) {
        res.status(500).json({ error: "Something went wrong!" });
    }


};


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // validate username, password 
    if (!email) {
        return res.status(400).json({
            error: "Please, enter email and password"
        });

    }

    try {

    }
    catch (error) {
        console.log("Error registering user:", error);
        res.status(200).json({ error: "Something went wrong!" });
    }
}

const getUserByTd = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve user data" });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.findAll();
        res.status(200).json(users);
        console.log("Retrieve all users");

    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrive user data" })
    }
};



const getUserDashboard = async (req, res, next) => {
    try {
        const id = req.user?.id;
        const user = await userModel.findOne({ where: { id } });
        if (!user) {
            return next(createError(404, "User not found"));
        }

    } 
    
    catch (err) {
        next(err);
    }
}



module.exports = { registerUser, loginUser, getUserByTd, getAllUsers, getUserDashboard };