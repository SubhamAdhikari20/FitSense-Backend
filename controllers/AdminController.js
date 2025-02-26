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
    const { email } = req.body;
    const profilePicture = req.file ? req.file.path : null;

    try {
        // Check existing admin
        const admin = await adminModel.findOne({ where: { email } });
        if (!admin) {
            return res.status(400).json({ error: "Email does not match!" })
        }

        await admin.update({ profilePicture });

        return res.status(201).json({ message: "Profile Picture updated successfully!", profilePicture });
    }
    catch (error) {
        // console.log(fullName, email, phoneNumber);
        console.log("Error registering admin:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }

}

const deleteAdminByEmail= async (req, res) => {
    const { email } = req.admin;

    try {
        const admin = await adminModel.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found!" });
        }

        // Delete the admin record
        await admin.destroy();
        return res.status(200).json({ message: "Account deleted successfully!"});
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to retrieve admin data" });
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



module.exports = { loginAdmin, forgotPassword, uploadImage, deleteAdminByEmail, getAdminByEmail, getAllAdmins, getAdminDashboard };