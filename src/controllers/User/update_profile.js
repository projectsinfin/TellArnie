const User = require("../../models/User");
const config = require("../../../config/config");
const fs = require("fs");
const Validation = require("../../utils/Validation");

const update_profile = async (req, res) => {
  try {
    const { SERVER_BASE_URL } = config;
    const { userId } = req.user;

    const user = await User.findById(userId);

    const updateData = {};

    if (req.body.first_name) {
      updateData.first_name = req.body.first_name;
    }

    if (req.body.last_name) {
      updateData.last_name = req.body.last_name;
    }

    if (req.body.location) {
      updateData.location = req.body.location;
    }

    if (req.body.employee_id) {
      updateData.employee_id = req.body.employee_id;
    }else{
      updateData.employee_id = "";
    }

    if (req.body.is_mentally_fit) {
      updateData.is_mentally_fit = req.body.is_mentally_fit;
    }

    if (req.body.job_title) {
      updateData.job_title = req.body.job_title;
    }
    if (req.body.assigned_role) {
      updateData.assigned_role = req.body.assigned_role;
    }
    if (req.body.is_firstaid_certified) {
      updateData.is_firstaid_certified = req.body.is_firstaid_certified;
    }
    if (req.body.firstaid_certificate_date) {
      updateData.firstaid_certificate_date = req.body.firstaid_certificate_date;
    }


    if (req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === "profile_pic") {
          const profile_pic_name = file.filename;
          updateData.profile_pic = `${SERVER_BASE_URL}profile_pictures/${profile_pic_name}`;
        }
        if (file.fieldname === "firstaid_certificate") {
          const firstaid_certificate_name = file.filename;
          updateData.firstaid_certificate = `${SERVER_BASE_URL}firstaid_certificates/${firstaid_certificate_name}`;
        }
        // Add more conditions for other file uploads if needed
      });
    }

      

    if (req.body.contact_number) {
      updateData.contact_number = req.body.contact_number;
      updateData.country_code = req.body.country_code;
    }else{
      updateData.contact_number = "";
      updateData.country_code = req.body.country_code;
    }

    

    if (req.body.email) {
      if (req.body.email !== user.email) {
        const existingUserEmail = await User.findOne({
          _id: { $ne: userId }, // Exclude current user
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
      await User.findByIdAndUpdate(userId, updateData);
    }

    await updateProfile();

    const result = await User.findById(userId);

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

module.exports = update_profile;

