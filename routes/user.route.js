const userRouter = require("express").Router();
const { user: User } = require("../models");
const auth = require("../middleware/auth");
const { generateAPIKey } = require("../utils/user/login");

userRouter.get("/login", async (req, res) => {
  let { address } = req.body;

  if (!address) {
    res.status(400).send({
      message: "Please provide an address",
    });
    return;
  }

  let userExists = await User.findOne({
    where: {
      address: address,
    },
  });

  if (userExists) {
    res.status(200).send({
      message: "User exists",
      token: generateAPIKey(address),
    });
    return;
  } else {
    await User.create({
      address: address,
    });
    res.status(400).send({
      message: "New user created",
      token: generateAPIKey(address),
    });
  }
});

userRouter.post("/subscribe", auth, async (req, res) => {
  let address = req.address;
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
    return;
  }

  if (tier == 1) {
    user.developer = true;
  } else if (tier == 2) {
    user.startup = true;
  } else if (tier == 3) {
    user.enterprise = true;
  }
  await user.save();

  if (tier == -1) {
    user.developer = false;
  } else if (tier == -2) {
    user.startup = false;
  } else if (tier == -3) {
    user.enterprise = false;
  }
  await user.save();

  res.status(200).send({
    message:
      tier == -1
        ? "Unsubscribed from developer tier"
        : tier == -2
        ? "Unsubscribed from startup tier"
        : tier == -3
        ? "Unsubscribed from enterprise tier"
        : tier == 1
        ? "Subscribed to developer tier"
        : tier == 2
        ? "Subscribed to startup tier"
        : tier == 3
        ? "Subscribed to enterprise tier"
        : "Something went wrong",
  });
});

userRouter.get("/", auth, async (req, res) => {
  let address = req.address;

  let user = await User.findOne({
    where: {
      address: address,
    },
  });

  res.status(200).send({
    address: user.address,
    developer: user.developer,
    startup: user.startup,
    enterprise: user.enterprise,
    credits: user.credits,
  });
});

userRouter.post("/withdraw", auth, async (req, res) => {
  let address = req.address;

  let user = await User.findOne({
    where: {
      address: address,
    },
  });

  let { amount } = req.body;

  if (!amount) {
    res.status(400).send({
      message: "Please provide the amount of credits to withdraw",
    });
    return;
  }

  if (user.credits < amount) {
    res.status(400).send({
      message:
        "You do not have enough credits to withdraw , use /api/user to check your balance",
    });
    return;
  }

  user.credits -= amount;

  await user.save();

  res.status(200).send({
    message: "Successfully withdrew credits",
  });
});

module.exports = userRouter;
// NOTE https://replit.com/@mcintyre94/sign-partial-sign#index.js
// https://solana.stackexchange.com/questions/542/what-is-the-difference-between-signing-and-partial-signing-a-transaction
