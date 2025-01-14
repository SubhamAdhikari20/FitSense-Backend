// Initializaton 
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./database/Database");
const userRoute = require("./routes/UserRoute");

// Creating a server 
const app = express();

// Creating a port 
const PORT = process.env.Port || 7777;

// Creating a middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.send("Welcome to the page");
    
});

app.get("/notice", (req, res)=>{
    res.send("This is notice");

});

// User Route
app.get("/user", userRoute);



// Running on PORT
app.listen(PORT, ()=>{
    console.log(`Server Running on......................... PORT ${PORT}`);
    
})