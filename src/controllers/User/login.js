const users = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../../config/config");
const accesstoken_generator = require("../../../middleware/user/accesstoken_generator");
const refreshtoken_generator = require("../../../middleware/user/refreshtoken_generator");
const Token = require("../../models/Token");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let User = await users.findOne({
      email: email,
    });

    console.log(User)

    if (User == null) {
      res.status(401).json({
        data: null,
        status: 401,
        message: "No account found",
      });
    } else if (!User.verified) {
      res.status(401).json({
        data: null,
        status: 401,
        message: "Verify your account first",
      });
    } else {
      if (bcrypt.compareSync(password, User.password)) {
        const access_token = accesstoken_generator(User);
        const refresh_token = refreshtoken_generator(User);

        const dbToken = new Token({ token: access_token });
        dbToken.save();

        res.status(200).json({
          data: {
            message: `Welcome ${User.first_name} ${User.last_name}`,
            access_token: access_token,
            refresh_token: refresh_token,
            user_id: User._id,
            role: User.assigned_role,
            verified: User.verified,
            is_approved: User.is_approved,
            status: true,
          },
          status: 200,
          message: "User login successfully.",
        });
      } else {
        res.status(401).json({
          data: null,
          status: 401,
          message: "Password do not match.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error,
    });
  }
};

module.exports = login;
