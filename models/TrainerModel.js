const { DataTypes } = require("sequelize");

const {sequelize} = require("../database/Database");

const Trainer = sequelize.define("Trainer", {
    trainerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});


module.exports = Trainer;