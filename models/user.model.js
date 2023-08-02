const { DataTypes } = require("sequelize");
const client = require("../client/db");

/**
 * A model to store info regarding the users
 */

const user = client.define("user", {
  address: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
});

module.exports = { user };
