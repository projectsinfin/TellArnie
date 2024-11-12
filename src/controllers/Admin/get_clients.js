const User = require("../../models/User");
const Company = require("../../models/Company");
const Distributor = require("../../models/Distributor");

const get_clients = async (req, res) => {
  try {
    const { userId } = req.user;
    const distributor = await User.findById(userId);

    // Find sub distributors' emails excluding 'rm_superadmin'
    const sub_distributors = await User.find({ 
      company_id: distributor.company_id,
      assigned_role: { $ne: "rm_superadmin" }
    }, "email");

    // Array to store company details associated with each email
    const usersWithCompanyInfo = [];


    // Iterate over each sub distributor's email
    for (const sub_distributor of sub_distributors) {
      const { email } = sub_distributor;

      // Find the company associated with the sub distributor's email
      const company = await Company.find({ distributor_email: email });

      usersWithCompanyInfo.push(company);

    }


    res.status(200).json({
      data: {
        Users: usersWithCompanyInfo,
      },
      message: `Users found successfully.`,
      status: 200
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching users:', error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = get_clients;
