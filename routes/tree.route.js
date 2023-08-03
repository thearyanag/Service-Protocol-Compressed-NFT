const treeRouter = require("express").Router();
const { tree } = require("../models");
const { user : User } = require("../models");

treeRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

treeRouter.post("/add", async (req, res) => {
  let address = req.address;

  let { tier, metadata, owner, collection } = req.body;

  // collection = 
  // collectionMint,
  // collectionMetadata,
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
      message: "Please provide collection",
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
        message: "User not subscribed to tier",
      });
      return;
    }
  } else if (tier == 2) {
    if (!user.startup) {
      res.status(400).send({
        message: "User not subscribed to tier",
      });
      return;
    }
  } else if (tier == 3) {
    if (!user.enterprise) {
      res.status(400).send({
        message: "User not subscribed to tier",
      });
      return;
    }
  }

  let treeAccount = await tree.findOne({
    where: {
      id: tier,
    },
  });
});

module.exports = treeRouter;
