const User = require("../../models/User");
const bcrypt = require("bcrypt");
const moment = require("moment");
const accesstoken_generator = require("../../../middleware/user/accesstoken_generator");
const refreshtoken_generator = require("../../../middleware/user/refreshtoken_generator");

// Route to handle password reset link
const reset_password = async (req, res) => {
  try {

    const { otp, user_id, password, confirm_password } = req.body;

    // Check if the token is valid
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json({ message: "User not found", status: 400 });
    }

    const otp_expiration_time = moment(user.otp_expiration_time);
    const current_date = moment();
    const has_otp_expired = current_date.isAfter(otp_expiration_time);

    if (user.otp == otp && !has_otp_expired) {

      if (password == confirm_password) {

        const hashPassword = await bcrypt.hash(password, 10);

        await user.updateOne({
          verified: true,
          password: hashPassword, // Set the password in the user table
        });
      } else {
        return res.status(400).json({
          message: "Password and confirm does not match.",
          status: 400,
        });
      }

      const access_token = accesstoken_generator(user);
      const refresh_token = refreshtoken_generator(user);

      return res.status(200).json({
        data: {
          message: `Welcome ${user.first_name} ${user.last_name}`,
          access_token: access_token,
          refresh_token: refresh_token,
          user_id: user._id,
          role: user.assigned_role,
          verified: user.verified
        },
        message: "Password reset successfully.",
        status: 200,
      });
    } else {
      return res.status(401).json({
        message: `OTP is either expired or invalid.`,
        status: 401,
      });
    }
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error,
    });
  }
};

module.exports = reset_password;
