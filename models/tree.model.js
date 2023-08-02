const { DataTypes } = require("sequelize");
const client = require("../client/db");

/**
 * A model to store private keys of all the trees
 */
const tree = client.define("tree", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  private_key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  public_key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  depth: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  buffer_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  canopy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { tree };
