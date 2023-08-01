const { Sequelize, DataTypes } = require("sequelize");

/**
 * A model to store private keys of all the trees
 */
const tree = Sequelize.define("tree", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  privateKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publicKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = tree;