const User = require("../../models/User");

const delete_user_by_id = async (req, res) => {
  try {
    const userId = req.query.id; // Assuming userId is provided as a query parameter

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        message: "No user ID provided in the request query.",
        status: 400
      });
    }

    // Delete the user by their ID
    const deletionResult = await User.findByIdAndDelete(userId);

    if (!deletionResult) {
      return res.status(400).json({
        message: "User not found or already deleted.",
        status: 400
      });
    }

    res.status(200).json({
      message: "User deleted successfully.",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
};

module.exports = delete_user_by_id;
