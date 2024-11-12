const Report = require("../../models/Report");
const User = require("../../models/User");

const create_report = async (req, res) => {
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

    const {
      report_name,
      start_on,
      frequency_units,
      how_often,
      send_to_group,
      send_to_user,
      report_widget_id,
    } = req.body;

    const report_data = {};

    console.log(req.body);

    report_data.company_id = user.company_id;

    if (report_name) {
      report_data.report_name = report_name;
    }

    if (start_on) {
      report_data.start_on = start_on;
    }

    if (frequency_units) {
      report_data.frequency_units = frequency_units;
    }

    if (send_to_group) {
      report_data.send_to_group = send_to_group;
    }

    if (send_to_user) {
      report_data.send_to_user = send_to_user;
    }

    if (how_often) {
      report_data.how_often = how_often;
    }

    if (report_widget_id) {
      report_data.report_widget_id = report_widget_id;
    }

    let new_report = await Report.create(report_data);

    return res.status(200).json({
      message: `Report group created successfully.`,
      user_id: new_report._id,
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

module.exports = create_report;
