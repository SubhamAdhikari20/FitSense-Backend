// Load env file
const dotenv = require("dotenv");
dotenv.config();

// Initializaton 
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { databaseConnection } = require("./database/Database");
const userRoute = require("./routes/UserRoute");
const trainerRoute = require("./routes/TrainerRoute");
const adminRoute = require("./routes/AdminRoute");
const workoutRoute = require("./routes/WorkoutRoute");


// Creating a server 
const app = express();

// Creating a middleware
// app.use(cors());
// Creating a middleware with specific origin and credentials
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// User Route
app.use("/api/user", userRoute);

// Trainer Route
app.use("/api/trainer", trainerRoute);

// Admin Route
app.use("/api/admin", adminRoute);

// Workout Route
app.use("/api/user/workout", workoutRoute);

// Unified Logging
// app.use("/api/unified_logging" );


// app.get("/api", async (req, res) => {
//     res.status(200).json({
//         message: "Hello! World",
//     });
// });

app.get("/api", async (req, res) => {
    res.send(
        `<div>
            <h2>Welcome to Subham Adhikari</h2>
        </div>`);
});


// Creating a port 
const PORT = process.env.SERVER_PORT

// Running on PORT
app.listen(PORT, () => {
    console.log(`Server is running on......................... PORT: ${PORT}`);

});


databaseConnection();
