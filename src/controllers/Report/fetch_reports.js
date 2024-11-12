const Report = require("../../models/Report");
const User = require("../../models/User");

const fetch_reports = async (req, res) => {
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

    const reports = await Report.find();


    return res.status(200).json({
      message: `Report fetched successfully.`,
      data: reports,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error,
    });
  }
};

module.exports = fetch_reports;
