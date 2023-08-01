const treeRouter = require("express").Router();

treeRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = treeRouter;
