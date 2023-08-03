const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

// const {syncModels} = require("./utils/admin/setup/syncModels");
// syncModels();

const treeRouter = require("./routes/tree.route");
const adminRouter = require("./routes/admin.route");
const userRouter = require("./routes/user.route");

const auth = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/tree",auth , treeRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user" , userRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}.`);
});
