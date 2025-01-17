const trainerModel = require("../models/TrainerModel");

const getTrainer = async(req, res) => {
    try {
        const trainers = await trainerModel.findAll();
        res.status(200).json(trainers);
        console.log("Retrieve all trainers");
        
    } 
    catch (error) {
        res.status(500).josn({error: "Failed to retrive trainer data"})
    }
}

const createTrainer = async(req, res) => {
    try {
        const {username, password} = req.body;
        const newTrainer = await trainerModel.create(username, password);
        res.status(200).json(newTrainer);
        console.log("New trainer added");
        
    } 
    catch (error) {
        res.status(500).json({error: "Failed to add a trainer"});
    }
}

module.exports = {getTrainer, createTrainer};