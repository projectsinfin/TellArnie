const crypto = require('crypto');
const User = require("../../models/User");
const otp_generator = require("../../../middleware/user/otp_generator");
const send_otp = require("../../../middleware/user/send_otp.js");

const forget_password = async (req, res) => {
 try{
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found',status: false });
    }

    const otp = otp_generator();

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

    user.otp = otp;
    user.otp_expiration_time = expirationTime;
    user.verified = false;

    await user.save();
    const full_name = `${user.first_name} ${user.last_name}`;

    send_otp(email, otp, full_name);

    res.status(200).json(
        { 
            data:{
                otp:otp,
                user_id: user._id
            },
            message: 'Email send successfully.',
            status: 200,
        }
        );
    }
    catch (error) {
        res.status(500).json({
          data: null,
          status: 500,
          message: error,
        });
      }

 
};

module.exports = forget_password;


