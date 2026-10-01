const User = require("../models/User");

const profile = async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
};

const logout = async (req, res) => {
  return res.status(200).json({
    message: "Logout successful",
  });
};

module.exports = {
  profile,
  logout,
};
