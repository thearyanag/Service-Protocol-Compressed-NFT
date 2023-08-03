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
  basic : {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  developer : {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  startup : {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  enterprise : {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  credits : {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

module.exports = { user };
    