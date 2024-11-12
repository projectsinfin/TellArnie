const User = require("../../models/User");
const config = require("../../../config/config");
const fs = require("fs");
const Validation = require("../../utils/Validation");
const Company = require("../../models/Company");

const edit_business_profile = async (req, res) => {
  try {
    const { SERVER_BASE_URL } = config;
    const { userId } = req.user;

    const user = await User.findById(userId);

    const companyData = {};
    const userData = {};

    if (req.body.company_name) {
      companyData.company_name = req.body.company_name;
    }

    if (req.body.superadmin_email) {
      companyData.business_email = req.body.superadmin_email;
    }

    if (req.body.assigned_role) {
      userData.assigned_role = req.body.assigned_role;
    }
   

    // async function deleteProfilePicture() {
    //   if (user.profile_pic) {

    //     console.log('ffffff');
    //     const remaining_path = user.profile_pic.slice(LOCAL_BASE_URL.length);
    //     fs.unlink(`uploads/${remaining_path}`, (err) => {
    //       if (err) {
    //         console.error("Error deleting the file:", err);
    //       } else {
    //         console.log("File deleted successfully");
    //       }
    //     });
    //   }
    // }


    if (req.body.contact_number) {
      if (!req.body.country_code) {
        return res.status(400).json({
          message: "Country code is required.",
          status: 400,
        });
      }

      const existingUser = await User.findOne({
        contact_number: req.body.contact_number,
      });

      if (!existingUser) {
         userData.contact_number = req.body.contact_number;
         userData.country_code = req.body.country_code;
      }
    }

    if (req.files.length > 0) {
      if (req.files[0].fieldname == "company_logo") {
        const company_logo_name = req.files[0].filename;
        companyData.business_logo = `${SERVER_BASE_URL}company_logo_pictures/${company_logo_name}`;
      }
    }


    async function updateProfile() {
      await User.findByIdAndUpdate(userId, userData);
    }

    async function updateCompanyProfile() {
      await Company.findByIdAndUpdate(user.company_id, companyData);
    }

    await updateProfile();

    await updateCompanyProfile();
   

    return res.status(200).json({
      message: `Successfully updated the business profile.`,
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

module.exports = edit_business_profile;
