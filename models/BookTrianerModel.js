const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");

const BookTrainer = sequelize.define("BookTrainer", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    trainerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    booked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },

}, {
    tableName: "BookTrainer", 
    timestamps: true,   // This ensures Sequelize uses 'createdAt' and 'updatedAt'
});


module.exports = BookTrainer;