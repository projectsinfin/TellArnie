const Notification = require("../../models/Notifications");
const User = require("../../models/User");

const update_notification_by_id = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    const {
      title,
      message,
      send_message_to,
      location,
      industry,
      status,
      revisions,
      publish_on,
      category,
      id
    } = req.body;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        data: null,
        status: 404,
        message: "Notification not found",
      });
    }

    // Update the notification fields
    notification.title = title;
    notification.message = message;
    notification.send_message_to = send_message_to;
    notification.location = location;
    notification.industry = industry;
    notification.status = status;
    notification.revisions = revisions;
    notification.publish_on = publish_on;
    notification.category = category;
    notification.company_id = user.company_id;
    notification.updated_by = user._id;

    // Save the updated notification
    await notification.save();

    return res.status(200).json({
      data: {
        message: "Notification updated successfully.",
        notification_id: notification._id,
      },
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = update_notification_by_id;
