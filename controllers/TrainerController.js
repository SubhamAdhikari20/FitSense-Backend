const trainerModel = require("../models/TrainerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const registerTrainer = async (req, res) => {
    const { fullName, email, phoneNumber, experience, password } = req.body;
    // const profilePicture = req.

    // validate trainer details
    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({ error: "Please, insert all details!!!" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email format!" });
    }

    if (!/^\d+$/.test(phoneNumber)) {
        return res.status(400).json({ error: "Phone number must contain only digits!" });
    }

    if (!/^\d+$/.test(experience)) {
        return res.status(400).json({ error: "Experience must contain only digits!" });
    }

    if (phoneNumber.length !== 10) {
        return res.status(400).json({ error: "Nepali numbers must be 10 digits!" });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters!" });
    }

    try {
        // Check existing trainer
        console.log(fullName, email, phoneNumber);
        const checkExistingTrainer = await trainerModel.findOne({ where: { email } });
        if (checkExistingTrainer) {
            return res.status(400).json({ error: "Email already exist!" })
        }

        // Hash the password
        const saltRound = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, saltRound);

        // Create new Trainer
        const newTrainer = await trainerModel.create({
            fullName,
            email,
            phoneNumber,
            experience: experience,
            password: hashedPassword,
            role: "trainer"
        });

        // Generate Token
        const token = jwt.sign(
            { id: newTrainer.id, email: newTrainer.email },
            process.env.JWT_SECRET,
            { expiresIn: "9999 years" }
        );

        res.status(200).json({ message: "Trainer registered successfully!", token: token, trainer: newTrainer });

    }
    catch (error) {
        console.error("Error registering trainer:", error);
        res.status(200).json({ error: "Internal server error!" });
    }

};



const loginTrainer = async (req, res) => {
    const { email, password } = req.body;

    // validate trainer email, password 
    if (!email || !password) {
        return res.status(400).json({
            error: "Please, enter email and password"
        });

    }
    try {
        // Check existing trainer
        const checkExistingTrainer = await trainerModel.findOne({ where: { email } });
        if (!checkExistingTrainer) {
            return res.status(400).json({ error: "Trainer doesnot already!" })
        }


        //Verify Trainer
        const isMatch = await bcrypt.compare(password, checkExistingTrainer.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Insert proper password!!!" })
        }

        // Generate Token
        const token = jwt.sign(
            { id: checkExistingTrainer.trainerId, email: checkExistingTrainer.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({ message: "Successfully logged as a Trainer", token: token, user: { ...checkExistingTrainer.dataValues, role: "trainer" } });

    }

    catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }


};


const forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    // validate email, password 
    if (!email || !newPassword) {
        return res.status(400).json({ error: "Please, enter email and new password" });
    }

    try {
        // Check existing trainer
        const checkExistingTrainer = await trainerModel.findOne({ where: { email } });
        if (!checkExistingTrainer) {
            return res.status(400).json({ error: "Email does not match!" })
        }

        // Hash the newPassword
        const saltRound = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, saltRound);

        // Reset Password
        await checkExistingTrainer.update({ password: hashedPassword });

        return res.status(200).json({ message: "Password reset successfully", trainer: checkExistingTrainer });
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
        const user = await trainerModel.findOne({ where: { id } });
        if (!user) {
            return res.status(400).json({ error: "Trainer Id does not match!" })
        }

        await user.update({ profilePicture });

        return res.status(201).json({ message: "Trainer Profile Picture updated successfully!", profilePicture });
    }
    catch (error) {
        // console.log(fullName, email, phoneNumber);
        console.log("Error registering user:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }

}


const updateTrainerProfileDetails = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phoneNumber, experience, gender, age, weight, height_ft, height_in } = req.body;

    try {
        const trainer = await trainerModel.findOne({ where: { id } });
        if (!trainer) return res.status(404).json({ error: "User not found!" });

        // Validate numerical fields
        if (isNaN(weight) || isNaN(height_ft) || isNaN(height_in)) {
            return res.status(400).json({ error: "Invalid weight or height values." });
        }

        // Convert height to meters and calculate BMI
        const heightMeters = (parseFloat(height_ft) * 0.3048) + (parseFloat(height_in) * 0.0254);
        const bmi = parseFloat(weight) / (heightMeters ** 2);
        const roundedBMI = parseFloat(bmi.toFixed(2));

        // Update user with BMI
        await trainer.update({
            fullName, email, phoneNumber, experience, gender, age,
            weight: parseFloat(weight),
            height_ft: parseFloat(height_ft),
            height_in: parseFloat(height_in),
            bmi: roundedBMI
        });

        return res.status(200).json({
            message: "Trainer Profile Details updated successfully!",
            user: trainer
        });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


const deleteTrainer= async (req, res) => {
    const { id } = req.body;

    try {
        const trainer = await trainerModel.findOne({ where: { id } });
        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found!" });
        }

        // Delete the trainer record
        await trainer.destroy();
        return res.status(200).json({ message: "Trainer Account deleted successfully!"});
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete trainer account" });
    }
}


const getTrainerByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        const trainer = await trainerModel.findOne({ where: { email } });
        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found!" });
        }
        
        return res.status(200).json({ trainer: trainer });
    } 
    catch (error) {
        console.error("Error in getTrainerByEmail:", error);
        return res.status(500).json({ error: "Failed to retrieve trainer data" });
    }
};



const getAllTrainers = async (req, res) => {
    try {
        const trainers = await trainerModel.findAll();
        return res.status(200).json({ trainers });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrive trainer data" })
    }
};



module.exports = { registerTrainer, loginTrainer, forgotPassword, uploadImage, updateTrainerProfileDetails, deleteTrainer, getTrainerByEmail, getAllTrainers };