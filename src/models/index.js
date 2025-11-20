const sequelize = require('../database');
const User = require('./User');

const models = { User };
async function initializeDatabase(options = { force: false, alter:false}){
    await sequelize.authenticate();
    await sequelize.sync(options);
    return models;
}

module.exports = {
    sequelize,
    models,
    initializeDatabase
};