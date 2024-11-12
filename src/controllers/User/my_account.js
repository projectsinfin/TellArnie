const User = require("../../models/User");
const Company = require("../../models/Company");

const my_account = async (req, res) => {
  try {
    const { userId } = req.user;
    const user_details = await User.findById(userId).select(
      "first_name last_name email contact_number profile_pic country_code country job_title verified assigned_role employee_id company_id is_mentally_fit is_firstaid_certified firstaid_certificate firstaid_certificate_date"
    );

    if (!user_details) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    // Fetch company name using company_id
    const company = await Company.findById(user_details.company_id).select(
      "company_name"
    );

    // Include company name in user details
    const userDetailsWithCompany = {
      ...user_details.toObject(),
      company_name: company ? company.company_name : null,
    };

    res.status(200).json({
      data: {
        user_details: userDetailsWithCompany,
      },
      message: `My account details`,
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

module.exports = my_account;
