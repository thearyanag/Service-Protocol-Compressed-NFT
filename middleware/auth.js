const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    // const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.address = decoded.address;
    next();
  } catch (e) {
    res.status(401).send({ message : "Please authenticate using your api secret" });
  }
};

module.exports = auth;