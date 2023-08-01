const { Sequelize, DataTypes } = require("sequelize");

/**
 * A model to store info regarding the users
*/

const user = Sequelize.define("user", {
    address : {
        type: DataTypes.STRING,
        primaryKey: true,
    },
});

module.exports = user;