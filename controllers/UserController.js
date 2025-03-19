const userModel = require("../models/UserModel");
const trainerModel = require("../models/TrainerModel");
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
            password: hashedPassword,
            role: "user"
        });

        // Generate Token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: `${process.env.JWT_SIGNUP_EXPIRES_IN}` }
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
            { id: checkExistingUser.id, email: checkExistingUser.email, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: `${process.env.JWT_LOGIN_EXPIRES_IN}` }
        );

        return res.status(200).json({ message: "Successfully logged as User", token: token, user: { ...checkExistingUser.dataValues, role: "user" } });

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

const uploadImage = async (req, res) => {
    const { id } = req.body;
    const profilePicture = req.file ? req.file.path : null;

    try {
        // Check existing user
        const user = await userModel.findOne({ where: { id } });
        if (!user) {
            return res.status(400).json({ error: "User Id does not match!" })
        }

        await user.update({ profilePicture });

        return res.status(201).json({ message: "User Profile Picture updated successfully!", profilePicture });
    }
    catch (error) {
        // console.log(fullName, email, phoneNumber);
        console.log("Error registering user:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }

}


const updateProfileDetails = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phoneNumber, gender, age, weight, height_ft, height_in } = req.body;

    try {
        const user = await userModel.findOne({ where: { id } });
        if (!user) return res.status(404).json({ error: "User not found!" });

        // Validate numerical fields
        if (isNaN(weight) || isNaN(height_ft) || isNaN(height_in)) {
            return res.status(400).json({ error: "Invalid weight or height values." });
        }

        // Convert height to meters and calculate BMI
        const heightMeters = (parseFloat(height_ft) * 0.3048) + (parseFloat(height_in) * 0.0254);
        const bmi = parseFloat(weight) / (heightMeters ** 2);
        const roundedBMI = parseFloat(bmi.toFixed(2));

        // Update user with BMI
        await user.update({
            fullName, email, phoneNumber, gender, age,
            weight: parseFloat(weight),
            height_ft: parseFloat(height_ft),
            height_in: parseFloat(height_in),
            bmi: roundedBMI
        });

        return res.status(200).json({
            message: "Profile updated successfully!",
            user: user
        });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


const deleteUser = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await userModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        console.log(user);

        // Delete the user record
        await user.destroy();
        return res.status(200).json({ message: "User Account deleted successfully!" });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to retrieve user data" });
    }
}

const getUserByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        const user = await userModel.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        return res.status(200).json({ user: user });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to retrieve user data" });
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await userModel.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        // Return the trainee data with the key 'trainee' (as expected on the frontend)
        return res.status(200).json({ trainee: user });
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return res.status(500).json({ error: "Failed to retrieve user data" });
    }
};


const getAllUsers = async (res) => {
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

const getAllTrainersByUser = async (req, res) => {
    try {
        const trainers = await trainerModel.findAll();
        return res.status(200).json({ trainers });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrive trainer data" })
    }
};


module.exports = { registerUser, loginUser, forgotPassword, uploadImage, updateProfileDetails, deleteUser, getUserByEmail, getUserById, getAllUsers, getAllTrainersByUser, getUserDashboard };