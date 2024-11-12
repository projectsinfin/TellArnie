const Report = require("../../models/Report");
const User = require("../../models/User");

const update_report = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if user has company ID
    if (!user.company_id) {
      return res
        .status(404)
        .json({ error: "User does not belong to any company." });
    }

    const { reportId } = req.query; // Assuming reportId is passed as a URL parameter

    // Check if the Report exists
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    // Ensure the report belongs to the same company as the user
    if (report.company_id.toString() !== user.company_id.toString()) {
      return res.status(403).json({ error: "User does not have permission to update this report." });
    }

    const {
      report_name,
      start_on,
      frequency_units,
      how_often,
      send_to_group,
      send_to_user,
      report_widget_id,
    } = req.body;

    // Update the report fields if they are provided
    if (report_name) {
      report.report_name = report_name;
    }

    if (start_on) {
      report.start_on = start_on;
    }

    if (frequency_units) {
      report.frequency_units = frequency_units;
    }

    if (how_often) {
      report.how_often = how_often;
    }

    if (send_to_group) {
      report.send_to_group = send_to_group;
    }

    if (send_to_user) {
      report.send_to_user = send_to_user;
    }

    if (report_widget_id) {
      report.report_widget_id = report_widget_id;
    }

    await report.save();

    return res.status(200).json({
      message: `Report updated successfully.`,
      report_id: report._id,
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

module.exports = update_report;
