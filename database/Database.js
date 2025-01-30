const { Sequelize } = require("sequelize");


const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
});

async function databaseConnection() {
    try {
        await sequelize.authenticate();
        console.log("Database Connection successful...................");
        // await sequelize.sync()
    }
    catch (error) {
        console.log("Unable to connect to databse!!.", error);
        process.exit(1);
    }
}


module.exports = {sequelize, databaseConnection};