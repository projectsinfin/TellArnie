const ReportGroup = require("../../models/ReportGroup");
const User = require("../../models/User");

const fetch_report_group = async (req, res) => {
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

    const report_groups = await ReportGroup.find({ company_id: user.company_id });


    return res.status(200).json({
      message: `Report group created successfully.`,
      data: report_groups,
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

module.exports = fetch_report_group;
