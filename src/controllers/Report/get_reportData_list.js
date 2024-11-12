const User = require("../../models/User");
const Validation = require("../../utils/Validation");
const config = require("../../../config/config");
const Company = require("../../models/Company");
const ReportGroup = require("../../models/ReportGroup");

const get_reportData_list = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    // // Check if user is superadmin
    // if (user.assigned_role !== "superadmin") {
    //   return res.status(403).json({ message: "You are not authorized to view this information." });
    // }

    // Fetch company name
    const company = await Company.findById(user.company_id);

    console.log(company.company_name)
    const company_name = company ? company.company_name : "";

    // Fetch users list excluding the current user
    const users_list = await User.find(
      { company_id: user.company_id, _id: { $ne: userId } }, // Exclude the current user
      "first_name last_name id assigned_role"
    );

    const report_group_list = await ReportGroup.find(
      { company_id: user.company_id}, // Exclude the current user
      "group_name"
    );

    // Format users list with company name
    const formattedUsers = users_list.map(user => ({
      ...user.toObject(),
      company_name: company_name
    }));

    res.status(200).json({
      data:{
        Users: formattedUsers,
        report_group_list: report_group_list
      },
      message: `Users found successfully.`,
      status:200
      
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching users:', error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error,
      });
  }
};

module.exports = get_reportData_list;
