const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");

const Workout = sequelize.define("Workout", {
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
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    workoutName: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    sets: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    reps: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    weight: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    caloriesBurned: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },

}, {
    tableName: "Workout",  // Explicitly specify the table name with correct case
    timestamps: true,   // This ensures Sequelize uses 'createdAt' and 'updatedAt'
});


module.exports = Workout;