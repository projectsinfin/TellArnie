const accesstoken_generator = require("../../../middleware/user/accesstoken_generator");
const refreshtoken_generator = require("../../../middleware/user/refreshtoken_generator");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const Validation = require("../../utils/Validation");
const Token = require("../../models/Token.js");

const register_approver_officer = async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      contact_number,
      employee_id,
      job_title,
      country_code,
      company_id,
      user_id
    } = req.body;
    const user_data = {};

    const user = await User.findById(user_id);

    if (email) {
      user_data.email = email;
      user_data.company_id = company_id;
      user_data.assigned_role = "approver";
    }

    if (first_name) {
      user_data.first_name = first_name;
    }

    if (last_name) {
      user_data.last_name = last_name;
    }else{
      user_data.last_name = "";
    }

    if (employee_id) {
      user_data.employee_id = employee_id;
    }else{
      user_data.employee_id = "";
    }

    if (job_title) {
      user_data.job_title = job_title;
    }
    if (country_code) {
      user_data.country_code = country_code;
    }
    if (contact_number) {
      user_data.contact_number = contact_number;
    }

    let new_user = await User.create(user_data);

    if (new_user) {
      // Generate tokens
      access_token = accesstoken_generator(user);
      refresh_token = refreshtoken_generator(user);

      const dbToken = new Token({ token: access_token });
      dbToken.save();
    }

    return res.status(200).json({
      data:{
        user_id: user_id,
        access_token: access_token,
        refresh_token: refresh_token,
        role:user.assigned_role
      },
      message: `Approval officer register successfully.`,
      status: 200,
    });
  } catch (error) {
    if (Validation().validateDuplicacy(error) === true) {
      res.status(500).json({
        data: null,
        status: 500,
        message: error,
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

module.exports = register_approver_officer;
