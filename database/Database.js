const {Sequelize} = require("sequelize");

// Load env file
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
});

async function databaseConnection(){
    try {
        await sequelize.authenticate();
        console.log("Database Connection successful...................");
        
    } 
    catch (error) {
        console.log("Unable to connect to databse!!.", error);
    }
}

databaseConnection();

module.exports = sequelize;