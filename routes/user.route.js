const userRouter = require("express").Router();
const { user: User } = require("../models");
const auth = require("../middleware/auth");

userRouter.get("/login", async (req, res) => {
  let { address } = req.body;

  let userExists = await User.findOne({
    where: {
      address: address,
    },
  });

  if (userExists) {
    res.status(200).send({
      message: "User exists",
    });
  } else {
    res.status(400).send({
      message: "User does not exist",
    });
  }
  await User.create({
    address: address,
  });
});

userRouter.post("/subscribe", auth, async (req, res) => {
  let address = req.user.address;
  let { tier } = req.body;

  let user = await User.findOne({
    where: {
      address: address,
    },
  });

  if (!tier) {
    res.status(400).send({
      message: "Please provide a tier",
    });
  }

  if (tier == 1) {
    user.developer = true;
  } else if (tier == 2) {
    user.startup = true;
  } else if (tier == 3) {
    user.enterprise = true;
  }
  await user.save();

  res.status(200).send({
    message: "User subscribed",
  });
});

userRouter.get("/", auth, async (req, res) => {
  let address = req.user.address;

  let user = await User.findOne({
    where: {
      address: address,
    },
  });

  user = {
    address: user.address,
    developer: user.developer,
    startup: user.startup,
    enterprise: user.enterprise,
    credits: user.credits,
  };

  res.status(200).send({
    user: user,
  });
});
