const Company = require('../../models/Company');
const User = require('../../models/User');

const fetch_business_details = async (req, res) => {
  try {
    // Fetch user details based on user ID
    const { userId } = req.user;
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if user has company ID
    if (!user.company_id) {
      return res.status(404).json({ error: "User does not belong to any company." });
    }

    const company = await Company.findById(user.company_id);

    // Check if company exists
    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    // Fetch superadmin list based on assigned_role
    const superadmin_list = await User.find({  assigned_role: { $in: ["rm_superadmin", "rm_admin"] },company_id:user.company_id }, "email first_name last_name id assigned_role");

    // Extract required fields from company and user objects
    const response = {
      message: "Business details found successfully.",
      business_profile: {
        company_name: company.company_name,
        country_code: user.country_code,
        contact_number: user.contact_number,
        email: company.business_email,
        assigned_role: user.assigned_role
      },
      superadmins: superadmin_list,
      status: 200
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    // Handle errors
    console.error('Error fetching business details:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_business_details;
