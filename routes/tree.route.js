const treeRouter = require("express").Router();
const { Keypair } = require("@solana/web3.js");
const { tree } = require("../models");
const bs58 = require("bs58");
const { user: User } = require("../models");
const { addNFTToTree } = require("../utils/tree/add");

treeRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

treeRouter.post("/add", async (req, res) => {
  let address = req.address;

  let { tier, metadata, owner, collection } = req.body;

  if (!owner) owner = address;

  // collection =
  // collectionMint,
  // collectionMetadata,
  // collectionAuthority
  // editionAccount,

  if (!tier) tier = 0;
  if (!owner) owner = address;

  if (!metadata) {
    res.status(400).send({
      message: "Please provide metadata",
    });
    return;
  }

  if (!collection) {
    res.status(400).send({
      message: "Please provide a valid collection data",
    });
    return;
  }

  let user = await User.findOne({
    where: {
      address: address,
    },
  });

  if (tier == 1) {
    if (!user.developer) {
      res.status(400).send({
        message: "User not subscribed to the tier",
      });
      return;
    }
  } else if (tier == 2) {
    if (!user.startup) {
      res.status(400).send({
        message: "User not subscribed to the tier",
      });
      return;
    }
  } else if (tier == 3) {
    if (!user.enterprise) {
      res.status(400).send({
        message: "User not subscribed to the tier",
      });
      return;
    }
  }

  let treeAccount = await tree.findOne({
    where: {
      id: tier,
    },
  });

  let secret = treeAccount.private_key;
  let buffer = Buffer.from(secret.split(","));
  let treeKeypair = Keypair.fromSecretKey(buffer);

  addNFTToTree(treeKeypair, owner, metadata, collection);
});

module.exports = treeRouter;
