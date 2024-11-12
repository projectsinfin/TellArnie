const otp_generator = require("../../../middleware/user/otp_generator");
const send_otp = require("../../../middleware/user/send_otp.js");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const Validation = require("../../utils/Validation");
const Company = require("../../models/Company.js");

const signup = async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      location,
      contact_number,
      country_code,
      employee_id,
      job_title,
    } = req.body;
    const user_data = {};

    // Validate input data here if needed
    if (!Validation().email(email)) {
      return res.status(400).json({
        status: 400,
        message: "Email is not valid",
      });
    }

    if (first_name) {
      user_data.first_name = first_name;
    }

    if (last_name) {
      user_data.last_name = last_name;
    } else {
      user_data.last_name = "";
    }

    if (employee_id) {
      user_data.employee_id = employee_id;
    } else {
      user_data.employee_id = "";
    }

    if (job_title) {
      user_data.job_title = job_title;
    }

    if (contact_number) {
      user_data.contact_number = contact_number;
      user_data.country_code = country_code;
    } else {
      user_data.contact_number = "";
      user_data.country_code = country_code;
    }

    const otp = otp_generator();

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

    user_data.otp = otp;
    user_data.otp_expiration_time = expirationTime;
    const full_name = `${first_name} ${last_name}`;

    // send_otp(email, otp, full_name);

    const existingEmail = await User.findOne({
      email: email,
    });

    const domain = email.split("@")[1];

    const existingComapnay = await Company.findOne({
      domain:domain
    });

    if(existingComapnay){
      user_data.company_id = existingComapnay._id;
      user_data.assigned_role = "admin";
      user_data.is_approved = false;
    }else{
      user_data.assigned_role = "superadmin";
      user_data.is_approved = true;
    }

    if (existingEmail && existingEmail.verified == false) {
      send_otp(email, otp, full_name);

      let exist_user = await User.findByIdAndUpdate(
        existingEmail._id,
        user_data
      );

      return res.status(200).json({
        data: {
          message: `OTP has been sent on ${req.body.email} for verification. Please check your spam/junk folder.`,
          user_id: exist_user._id,
          otp: user_data.otp,
          status: true,
        },
        status: 200,
        message: "Success",
      });
    } else if (existingEmail && existingEmail.verified == true) {
      return res.status(400).json({
        status: 400,
        message: "Email is already registered.",
      });
    } else {
      send_otp(email, otp, full_name);

      user_data.email = email;
      let new_user = await User.create(user_data);

      return res.status(200).json({
        data: {
          message: `OTP has been sent on ${req.body.email} for verification. Please check your spam/junk folder.`,
          user_id: new_user._id,
          otp: user_data.otp,
          status: true,
        },
        status: 200,
        message: "Success",
      });
    }
  } catch (error) {
    if (Validation().validateDuplicacy(error) === true) {
      res.status(500).json({
        data: null,
        status: 500,
        message: error.message,
      });
    } else {
      res.status(401).json({
        data: null,
        status: 401,
        message: Validation().validateDuplicacy(error),
      });
    }
  }
};

module.exports = signup;
