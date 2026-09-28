const { Seequelize } = require('sequelize');
// const dbConfig = require('../config/database');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/sqlite',
    logging: false
});

module.exports = sequelize;