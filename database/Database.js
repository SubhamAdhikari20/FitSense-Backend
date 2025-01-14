const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("fitsense", "postgres", "admin", {
    host: "localhost",
    dialect: "postgres",
    port: "5432",
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