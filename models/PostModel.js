const { DataTypes } = require("sequelize");

const sequelize = require("../database/Database");

const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postImage: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});
