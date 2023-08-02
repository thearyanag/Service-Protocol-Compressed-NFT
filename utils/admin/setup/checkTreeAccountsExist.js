const { tree } = require("../../../models");

async function checkTreeAccountsExist() {
  const treeAccounts = await tree.count();

  if (treeAccounts === 0) {
    return false;
  }

  return true;
}

module.exports = { checkTreeAccountsExist };
