const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createError } = require("./../error");
const dotenv = require("dotenv");
dotenv.config();


const registerUser = async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;
    // const profilePicture = req.

    // validate user details
    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({ error: "Please, insert all details!!!" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email format!" });
    }

    if (!/^\d+$/.test(phoneNumber)) {
        return res.status(400).json({ error: "Phone number must contain only digits!" });
    }

    if (phoneNumber.length !== 10) {
        return res.status(400).json({ error: "Nepali numbers must be 10 digits!" });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters!" });
    }


    try {
        // Check existing user
        const checkExistingUser = await userModel.findOne({ where: { email } });
        if (checkExistingUser) {
            return res.status(400).json({ error: "Email already exist!" })
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

        // Generate Token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "9999 years" }
        );

        return res.status(201).json({ message: "User registered successfully!", token: token, user: newUser });

    }
    catch (error) {
        // console.log(fullName, email, phoneNumber);
        console.log("Error registering user:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }

};



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // validate user, password 
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


        //Verify User with bcrypt
        const isMatch = await bcrypt.compare(password, checkExistingUser.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password!!!" })
        }

        // Generate Token
        const token = jwt.sign(
            { id: checkExistingUser.id, email: checkExistingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).json({ message: "Successfully logged in", token: token, user: checkExistingUser });

    }

    catch (error) {
        return res.status(500).json({ error: "Internal server error!" });
    }


};


const forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    // validate email, password 
    if (!email || !newPassword) {
        return res.status(400).json({ error: "Please, enter email and new password" });
    }

    try {
        // Check existing user
        const checkExistingUser = await userModel.findOne({ where: { email } });
        if (!checkExistingUser) {
            return res.status(400).json({ error: "Email does not match!" })
        }

        // Hash the newPassword
        const saltRound = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, saltRound);

        // Reset Password
        await checkExistingUser.update({ password: hashedPassword });

        return res.status(200).json({ message: "Password reset successfully", user: checkExistingUser });
    }
    catch (error) {
        console.log("Error while reseting password", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
}

const getUserByTd = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await userModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        return res.status(200).json({ user: user });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to retrieve user data" });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.findAll();
        return res.status(200).json({ users: users });

    }
    catch (error) {
        return res.status(500).json({ error: "Failed to retrive user data" })
    }
};


const getUserDashboard = async (req, res, next) => {
    try {
        const id = req.user?.id;
        const user = await userModel.findOne({ where: { id } });
        if (!user) {
            return next(createError(404, "User not found"));
        }

        return res.status(200).json({ user: user });
    }

    catch (err) {
        return next(err);
    }
}



module.exports = { registerUser, loginUser, forgotPassword, getUserByTd, getAllUsers, getUserDashboard };