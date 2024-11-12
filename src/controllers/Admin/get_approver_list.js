const User = require("../../models/User");
const Distributor = require("../../models/Distributor");

const get_approver_list = async (req, res) => {
  try {
    const { userId } = req.user;
    let user = await User.findById(userId);

if (!user) {
      user = await Distributor.findOne({ email: email });
}


    // Check if user is authorized
    if (!["rm_superadmin", "rm_admin", "distributor_superadmin", "distributor_user", "superadmin"].includes(user.assigned_role)) {
      return res.status(403).json({ message: "You are not authorized to view this information." });
    }

    let approvers_list, superadmins_list;

    // Fetch lists based on user role
    if (["superadmin", "admin", "distributor_superadmin"].includes(user.assigned_role)) {
      approvers_list = await User.find({ company_id: user.company_id, assigned_role: "user" }, "first_name last_name id assigned_role");
      superadmins_list = await User.find({ company_id: user.company_id, assigned_role: { $in: ["superadmin", "admin"] } }, "first_name last_name id assigned_role");
    } else {
      approvers_list = await User.find({ assigned_role: "user" }, "first_name last_name id assigned_role");
      superadmins_list = await User.find({ assigned_role: { $in: ["superadmin", "admin"] } }, "first_name last_name id assigned_role");
    }

    res.status(200).json({
      data: {
        Approvers: approvers_list,
        Superadmins: superadmins_list
      },
      message: `Approvers and Superadmins list found successfully.`,
      status: 200
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching users:', error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = get_approver_list;
