const { Sequelize } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://serviceprotocol:Aa@123456@localhost:5432/postgres';

module.exports = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
