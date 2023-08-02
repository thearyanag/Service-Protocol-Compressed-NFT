const { tree } = require("../../../models");

async function destroyTreeAccounts() {
  await tree.destroy({
    where: {},
    truncate: true,
  });
  console.log("Tree accounts destroyed");
}

module.exports = { destroyTreeAccounts };
