// Load env file
const dotenv = require("dotenv");
dotenv.config();

// Initializaton 
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {databaseConnection} = require("./database/Database");
const userRoute = require("./routes/UserRoute");
const trainerRoute = require("./routes/TrainerRoute");


// Creating a server 
const app = express();

// Creating a middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// User Route
app.use("/user", userRoute);

// Trainer Route
app.use("/trainer", trainerRoute);


// Creating a port 
const PORT = process.env.SERVER_PORT

// Running on PORT
app.listen(PORT, ()=>{
    console.log(`Server is running on......................... PORT: ${PORT}`);
    
});


databaseConnection();
