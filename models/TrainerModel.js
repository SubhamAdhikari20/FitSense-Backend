const { DataTypes } = require("sequelize");

const {sequelize} = require("../database/Database");

const Trainer = sequelize.define("Trainer", {
    id: {
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
        validate: {
            isEmail: true, 
        },
    },

    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //     isNumeric: true, 
        // },
    },

    experience: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [0, 2], 
        },
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 100], 
        },
    },

    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "Trainer",   
    timestamps: true,       
});


module.exports = Trainer;