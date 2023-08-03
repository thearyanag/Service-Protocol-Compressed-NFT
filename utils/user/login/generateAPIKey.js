const jwt = require("jsonwebtoken");

const generateAPIKey = (address) => {
  const token = jwt.sign({ address }, process.env.JWT_SECRET, {
    expiresIn: "30 days",
  });
  return token;
};

module.exports = {
  generateAPIKey,
};
