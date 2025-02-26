const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");

const Admin = sequelize.define("Admin", {
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
    tableName: "Admin",  // Explicitly specify the table name with correct case
    timestamps: true,   // This ensures Sequelize uses 'createdAt' and 'updatedAt'
});


module.exports = Admin;

