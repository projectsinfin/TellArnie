const User = require("../../models/User");

const approve_user = async (req, res) => {
  try {
    const userId = req.body.user_id; // Assuming user_id is provided in the request body
    const isApproved = req.body.is_approved; // Assuming is_approved is provided in the request body

    // Check if userId or isApproved is not provided
    if (!userId || isApproved === undefined) {
      return res.status(400).json({
        message: "User ID or approval status not provided.",
        status: 400
      });
    }

    // Update user's approval status
    const updateResult = await User.updateOne(
      { _id: userId },
      { $set: { is_approved: isApproved } }
    );

    if (updateResult.nModified === 0) {
      return res.status(400).json({
        message: "User not found or not updated.",
        status: 400
      });
    }

    // If is_approved is false, update assigned_role to "user"
    if (isApproved === false) {
      const updateUserRoleResult = await User.updateOne(
        { _id: userId },
        { $set: {is_approved:true, assigned_role: "user" } }
      );

      if (updateUserRoleResult.nModified === 0) {
        return res.status(400).json({
          message: "User role not updated.",
          status: 400
        });
      }
    }

    res.status(200).json({
      message: "User updated successfully.",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500
    });
  }
};

module.exports = approve_user;
