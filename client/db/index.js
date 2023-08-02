const { Sequelize } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL

module.exports = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    ssl : false,
    logging: false,
});
