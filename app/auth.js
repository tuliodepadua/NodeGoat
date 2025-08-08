const bcrypt = require("bcrypt");
const config = require("../config/config");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.bcryptRounds);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  hashPassword,
  verifyPassword,
  generatePasswordResetToken,
};
