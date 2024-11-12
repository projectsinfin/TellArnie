const User = require("../../models/User");
const config = require("../../../config/config");
const moment = require("moment");
const bcrypt = require("bcrypt");
const accesstoken_generator = require("../../../middleware/user/accesstoken_generator");
const refreshtoken_generator = require("../../../middleware/user/refreshtoken_generator");

const verify_otp = async (req, res) => {
  try {
    const { otp, user_id, password } = req.body;

    // Input validation
    if (!otp || !user_id || !password) {
      return res.status(400).json({
        message: "Missing required fields (otp, user_id, password)",
        status: 400,
      });
    }

    const user = await User.findById(user_id).exec();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    const access_token = accesstoken_generator(user);
    const refresh_token = refreshtoken_generator(user);


    const is_register_company = !!user.company_id; // Check if company_id is present

    if (user.verified) {
      return res.status(200).json({
        message: "User already verified",
        status: 200,
      });
    }

    const otp_expiration_time = moment(user.otp_expiration_time);
    const current_date = moment();
    const has_otp_expired = current_date.isAfter(otp_expiration_time);

    if (user.otp === otp && !has_otp_expired) {
      const hashPassword = await bcrypt.hash(password, 10);

      await user.updateOne({
        verified: true,
        password: hashPassword,
      });

      const updated_user = await User.findById(user_id);

      return res.status(200).json({
        data: {
          message: `Hi ${updated_user.first_name} ${updated_user.last_name}, your account has been cre `,
          user_id: user_id,
          is_register_company: is_register_company,
          access_token: access_token,
          refresh_token: refresh_token,
          role: updated_user.assigned_role,
          verified: updated_user.verified,
          is_approved:updated_user.is_approved,
          status: true,
        },
        message: "Successfully verified user",
        status: 200,
      });
    } else {
      return res.status(401).json({
        message: "OTP is either expired or invalid.",
        status: 401,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      error: error.message,
    });
  }
};

module.exports = verify_otp;
