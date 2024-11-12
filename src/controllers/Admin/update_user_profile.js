const User = require("../../models/User");
const config = require("../../../config/config");
const fs = require("fs");
const Validation = require("../../utils/Validation");

const update_user_profile = async (req, res) => {
  try {
    const { id } = req.params;

 const { SERVER_BASE_URL } = config;

    const user = await User.findById(id);

    const updateData = {};

    if (req.body.first_name) {
      updateData.first_name = req.body.first_name;
    }

    if (req.body.last_name) {
      updateData.last_name = req.body.last_name;
    }

    if (req.body.location_id) {
      updateData.location_id = req.body.location_id;
    }

    if (req.body.employee_id) {
      updateData.employee_id = req.body.employee_id;
    }else{
      updateData.employee_id = "";
    }

    if (req.body.job_title) {
      updateData.job_title = req.body.job_title;
    }
    if (req.body.assigned_role) {
      updateData.assigned_role = req.body.assigned_role;
    }

    if (req.body.permissions) {
      updateData.permissions = req.body.permissions;
    }

    if (req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === "profile_pic") {
          const profile_pic_name = file.filename;
          updateData.profile_pic = `${SERVER_BASE_URL}profile_pictures/${profile_pic_name}`;
        }
      });
    }

    if (req.body.contact_number || req.body.country_code) {
      if (!req.body.country_code) {
        return res.status(400).json({
          message: "Country code is required.",
          status: 400,
        });
      }

      if (req.body.contact_number !== user.contact_number) {
        const existingUserContact = await User.findOne({
          _id: { $ne: id }, // Exclude current user
          contact_number: req.body.contact_number,
        });

        if (existingUserContact) {
          return res.status(400).json({
            message: "Phone number already exists.",
            status: 400,
          });
        }
      }

      updateData.contact_number = req.body.contact_number;
      updateData.country_code = req.body.country_code;
    }

    if (req.body.email) {
      if (req.body.email !== user.email) {
        const existingUserEmail = await User.findOne({
          _id: { $ne: id }, // Exclude current user
          email: req.body.email,
        });

        if (existingUserEmail) {
          return res.status(400).json({
            message: "Email already registered to .",
            status: 400,
          });
        }
      }



      updateData.email = req.body.email;
    }

    async function updateProfile() {
      await User.findByIdAndUpdate(id, updateData);
    }

    await updateProfile();

    const result = await User.findById(id);

    return res.status(200).json({
      data: {
        user: result,
      },
      message: `Successfully updated the profile.`,
      status: 200,
    });
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

module.exports = update_user_profile;

