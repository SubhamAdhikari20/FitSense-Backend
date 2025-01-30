const trainerModel = require("../models/TrainerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const registerTrainer = async (req, res) => {
    const {fullName, email, phoneNumber, password} = req.body;
    // const profilePicture = req.

    if (!fullName || !email || !phoneNumber || !password) {
        return res.status(400).json({
            error: "Please, insert details"
        });
        
    }

    try {
        // Check existing trainer
        console.log(fullName, email, phoneNumber);
        const checkExistingTrainer = await trainerModel.findOne({where: {email}});
        if (checkExistingTrainer) {
            return res.status(400).json({error: "Email already exist!"})
        }
        
        // Hash the password
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        // Create new Trainer
        const newTrainer = await trainerModel.create({
            fullName, 
            email, 
            phoneNumber, 
            password: hashedPassword
        });

        // console.log(newTrainer)
        res.status(200).json({message: "Trainer registered successfully!", trainer: newTrainer});
        
    } 
    catch (error) {
        // console.log(fullName, email, phoneNumber);
        console.log("Error registering trainer:", error);
        res.status(200).json({error: "Something went wrong!"});
    }

};



const loginTrainer = async(req, res) => {
    const {email, password} = req.body;

    // validate trainername, password 
    if (!email || !password) {
        return res.status(400).json({
            error: "Please, enter email and password"
        });
        
    }
    try {
        // Check existing trainer
        const checkExistingTrainer = await trainerModel.findOne({where: email});
        if (!checkExistingTrainer) {
            return res.status(400).json({error: "Trainer already exist!"})
        }


        //Verify Trainer
        const isMatch = await bcrypt.compare(password,checkExistingTrainer.password)
        if(!isMatch){
            return res.status(400).json({error: "Insert proper password!!!"})
        }
    
        // generate Token
        const token = jwt.sign(
            { id: checkExistingTrainer.trainerId, email: checkExistingTrainer.email },
            process.env.JWT_SECRET,  
            { expiresIn: "24h" }
        );

        res.status(200).json({ message: "Successfully logged in", token });
        
    } 

    catch (error) {
        res.status(500).json({error: "Something went wrong!"});
    }


};



const getTrainerById = async (req, res) => {
    const { id } = req.params; 

    try {
        const trainer = await trainerModel.findOne({ where: { trainerId: id } });
        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found!" });
        }
        res.status(200).json(trainer);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve trainer data" });
    }
};



const getAllTrainers = async(req, res) => {
    try {
        const trainers = await trainerModel.findAll();
        res.status(200).json(trainers);
        console.log("Retrieve all trainers");
        
    } 
    catch (error) {
        res.status(500).json({error: "Failed to retrive trainer data"})
    }
};




module.exports = {registerTrainer, loginTrainer, getTrainerById, getAllTrainers};