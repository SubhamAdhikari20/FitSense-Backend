const adminModel = require("../models/AdminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createError } = require("./../error");
const dotenv = require("dotenv");
dotenv.config();


const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    // validate admin, password 
    if (!email || !password) {
        return res.status(400).json({
            error: "Please, enter email and password"
        });

    }

    try {
        // Check existing admin
        const checkExistingAdmin = await adminModel.findOne({ where: { email } });
        if (!checkExistingAdmin) {
            return res.status(400).json({ error: "Admin does not exist!" })
        }


        //Verify Admin with bcrypt
        if (password !== checkExistingAdmin.password){
            const isMatch = await bcrypt.compare(password, checkExistingAdmin.password)
            if (!isMatch) {
                return res.status(400).json({ error: "Incorrect password!!!" })
            }
        }

        // Generate Token
        const token = jwt.sign(
            { id: checkExistingAdmin.id, email: checkExistingAdmin.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).json({ message: "Successfully logged as Admin", token: token, user: { ...checkExistingAdmin.dataValues, role: "admin" } });

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
        // Check existing admin
        const checkExistingAdmin = await adminModel.findOne({ where: { email } });
        if (!checkExistingAdmin) {
            return res.status(400).json({ error: "Email does not match!" })
        }

        // Hash the newPassword
        const saltRound = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, saltRound);

        // Reset Password
        await checkExistingAdmin.update({ password: hashedPassword });

        return res.status(200).json({ message: "Password reset successfully", admin: checkExistingAdmin });
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
        const admin = await adminModel.findOne({ where: { id } });
        if (!admin) {
            return res.status(400).json({ error: "admin Id does not match!" })
        }

        await admin.update({ profilePicture });

        return res.status(201).json({ message: "admin Profile Picture updated successfully!", profilePicture });
    }
    catch (error) {
        // console.log(fullName, email, phoneNumber);
        console.log("Error registering user:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }

}


const updateAdminProfileDetails = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phoneNumber, gender, age, weight, height_ft, height_in } = req.body;

    try {
        const admin = await adminModel.findOne({ where: { id } });
        if (!admin) return res.status(404).json({ error: "User not found!" });

        // Validate numerical fields
        if (isNaN(weight) || isNaN(height_ft) || isNaN(height_in)) {
            return res.status(400).json({ error: "Invalid weight or height values." });
        }

        // Convert height to meters and calculate BMI
        const heightMeters = (parseFloat(height_ft) * 0.3048) + (parseFloat(height_in) * 0.0254);
        const bmi = parseFloat(weight) / (heightMeters ** 2);
        const roundedBMI = parseFloat(bmi.toFixed(2));

        // Update admin with BMI
        await admin.update({
            fullName, email, phoneNumber, gender, age,
            weight: parseFloat(weight),
            height_ft: parseFloat(height_ft),
            height_in: parseFloat(height_in),
            bmi: roundedBMI
        });

        return res.status(200).json({
            message: "Admin Profile updated successfully!",
            user: admin
        });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


const deleteAdmin = async (req, res) => {
    const { id } = req.user;

    try {
        const admin = await adminModel.findOne({ where: { id } });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found!" });
        }
        console.log(user);

        // Delete the user record
        await adminModel.destroy();
        return res.status(200).json({ message: "Admin Account deleted successfully!" });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to retrieve user data" });
    }
}

const getAdminByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        const admin = await adminModel.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found!" });
        }

        return res.status(200).json({ admin: admin });
    }
    catch (error) {
        
        return res.status(500).json({ error: "Failed to retrieve admin data" });
    }
};


const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminModel.findAll();
        return res.status(200).json({ admins: admins });

    }
    catch (error) {
        return res.status(500).json({ error: "Failed to retrive admin data" })
    }
};


const getAdminDashboard = async (req, res, next) => {
    try {
        const id = req.admin?.id;
        const admin = await adminModel.findOne({ where: { id } });
        if (!admin) {
            return next(createError(404, "Admin not found"));
        }

        return res.status(200).json({ admin: admin });
    }

    catch (err) {
        return next(err);
    }
}



module.exports = { loginAdmin, forgotPassword, uploadImage, updateAdminProfileDetails, deleteAdmin, getAdminByEmail, getAllAdmins, getAdminDashboard };