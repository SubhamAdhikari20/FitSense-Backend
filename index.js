// Initializaton 
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./database/Database");
const userRoute = require("./routes/UserRoute");
const trainerRoute = require("./routes/TrainerRoute");

// Load env file
const dotenv = require("dotenv");
dotenv.config();

// Creating a server 
const app = express();

// Creating a middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Routes
app.get("/", (req, res)=>{
    res.send("Welcome to the page");
    
});

app.get("/notice", (req, res)=>{
    res.send("This is notice");

});

// User Route
app.get("/user", userRoute);

// Trainer Route
app.get("/trainer", trainerRoute);


// Creating a port 
const PORT = process.env.SERVER_PORT

// Running on PORT
app.listen(PORT, ()=>{
    console.log(`Server is running on......................... PORT: ${PORT}`);
    
})