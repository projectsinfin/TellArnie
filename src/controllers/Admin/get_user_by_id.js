const User = require("../../models/User");
const Company = require("../../models/Company");
const Location = require("../../models/Location");

const get_user_by_id = async (req, res) => {
  try {
    const { id } = req.params;

    const user_details = await User.findById(id).select(
      "first_name last_name email contact_number profile_pic country_code country job_title verified assigned_role employee_id company_id is_mentally_fit is_firstaid_certified firstaid_certificate firstaid_certificate_date location_id permissions is_approved"
    );

    if (!user_details) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    // Ensure permissions are an array
    let permissions = user_details.permissions;

    if (!Array.isArray(permissions)) {
      try {
        permissions = JSON.parse(permissions);
      } catch (error) {
        return res.status(500).json({
          data: null,
          status: 500,
          message: "Permissions format is invalid.",
        });
      }
    }

    // Fetch location name using location_id
    const location = await Location.findById(user_details.location_id).select("location_name");

    // Determine status based on is_approved
    const status = user_details.is_approved ? "Approved" : "Pending Approval";

    // Include location name and status in user details
    const userDetailsWithCompany = {
      ...user_details.toObject(),
      permissions, // Ensure permissions is an array
      location_name: location ? location.location_name : null,
      status, // Add the status field
    };

    res.status(200).json({
      data: {
        user_details: userDetailsWithCompany,
      },
      message: `User details fetched successfully.`,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = get_user_by_id;
