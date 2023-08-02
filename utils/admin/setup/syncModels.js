const { tree , user } = require("../../../models");
const client = require("../../../client/db");

async function syncModels() {
  await client.sync();
  console.log("Models synced");
}

module.exports = { syncModels };
