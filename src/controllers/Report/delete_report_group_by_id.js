const ReportGroup = require("../../models/ReportGroup");

const delete_report_group_by_id = async (req, res) => {
  try {
    const ReportGroupId = req.query.id;

    // Check if locationId is valid
    if (!ReportGroupId) {
      return res.status(400).json({
        message: "Report Group ID is missing in the request parameters.",
        status: 400
      });
    }

    // Find the location by ID and delete it
    const deletionResult = await ReportGroup.deleteOne({ _id: ReportGroupId });

    if (deletionResult.deletedCount === 0) {
      return res.status(400).json({
        message: "No Report Group was deleted. Report group ID not found.",
        status: 400
      });
    }

    res.status(200).json({
      message: "Report Group deleted successfully.",
      status: 200
    });
  } catch (error) {
    // Handle database errors or other exceptions
    console.error('Error deleting Report Group:', error);
    res.status(500).json({
      error: "Internal Server Error",
      status: 500
    });
  }
};

module.exports = delete_report_group_by_id;
