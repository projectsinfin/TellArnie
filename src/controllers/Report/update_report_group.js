const ReportGroup = require("../../models/ReportGroup");
const User = require("../../models/User");

const update_report_group = async (req, res) => {
  try {
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

    const { groupId } = req.query; // Assuming groupId is passed as a URL parameter

    // Check if the ReportGroup exists
    const report_group = await ReportGroup.findById(groupId);
    if (!report_group) {
      return res.status(404).json({ error: "Report group not found." });
    }

    // Ensure the report group belongs to the same company as the user
    if (report_group.company_id.toString() !== user.company_id.toString()) {
      return res.status(403).json({ error: "User does not have permission to update this report group." });
    }

    const { group_name, group_member } = req.body;

    // Update the report group fields if they are provided
    if (group_name) {
      report_group.group_name = group_name;
    }

    if (group_member) {
      report_group.group_member = group_member;
    }

    await report_group.save();

    return res.status(200).json({
      message: `Report group updated successfully.`,
      report_group_id: report_group._id,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = update_report_group;
