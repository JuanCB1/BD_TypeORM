const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(120),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(180),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        role: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user'
        }
    },
    {
        tableName: 'users',
        underscored: true 
    }
);

module.exports = User;