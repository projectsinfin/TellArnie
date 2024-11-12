const ReportGroup = require("../../models/ReportGroup");
const User = require("../../models/User");

const create_report_group = async (req, res) => {
  try {

    const { userId } = req.user;
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found."});
    }

    // Check if user has company ID
    if (!user.company_id) {
      return res.status(404).json({ error: "User does not belong to any company." });
    }

    const {
      group_name,
      group_member,
    } = req.body;

    const group_data = {};

    console.log(req.body)


    group_data.company_id = user.company_id;

    if (group_name) {
      group_data.group_name = group_name;
    }

    if (group_member) {
      group_data.group_member = group_member;
    }

    let new_report_group = await ReportGroup.create(group_data);

    return res.status(200).json({
      message: `Report group created successfully.`,
      user_id: new_report_group._id,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error,
    });
  }
};

module.exports = create_report_group;
