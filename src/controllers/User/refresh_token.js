const config = require("../../../config/config");
const accesstoken_generator = require("../../../middleware/user/accesstoken_generator");
const refreshtoken_generator = require("../../../middleware/user/refreshtoken_generator");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = config;

const refresh_token = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  jwt.verify(refresh_token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const access_token = accesstoken_generator(user);
    const refresh_token = refreshtoken_generator(user);

    res.json({
      access_token: access_token,
      refresh_token: refresh_token,
    });
  });
};

module.exports = refresh_token;
