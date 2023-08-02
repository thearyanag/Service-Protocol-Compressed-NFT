const adminRouter = require("express").Router();

const {
  createTreeAccounts,
  checkTreeAccountsExist,
  syncModels,
} = require("../utils/admin/setup");

const { destroyTreeAccounts } = require("../utils/admin/reset");

adminRouter.post("/setup", async (req, res) => {
  await syncModels();

  let ifExists = await checkTreeAccountsExist();

  if (!ifExists) {
    await createTreeAccounts();
    res.status(200).send({
      message: "Tree accounts created, please make sure to have 90 SOL in your private key to fund the accounts",
    });
  } else {
    res.status(400).send({
      message: "Tree accounts already exist, use /api/admin/reset to reset",
    });
  }
});

adminRouter.post("/reset", async (req, res) => {
  await syncModels();

  let ifExists = await checkTreeAccountsExist();

  if (ifExists) {
    await destroyTreeAccounts();

    res.status(200).send({
      message: "Tree accounts reset",
    });
  } else {
    res.status(400).send({
      message: "Tree accounts do not exist, use /api/admin/setup to setup",
    });
  }
});

module.exports = adminRouter;
