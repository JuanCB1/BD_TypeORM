const path = require('path');
const { Sequelize } = require('sequelize');

const storage = 'database.sqlite';
const loggingFlag = false;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(process.cwd(), storage),
    logging: loggingFlag ? console.log : false
});

module.exports = sequelize;