const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const treeRouter = require("./routes/tree.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/tree", treeRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}.`);
});
