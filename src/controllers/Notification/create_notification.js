const notification = require("../../models/Notifications");
const User = require("../../models/User");

const create_notification = async (req, res) => {
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
      // restrict_notification
    } = req.body;

    const article_data = {
      title,
      message,
      send_message_to,
      location,
      industry,
      status,
      revisions,
      publish_on,
      category,
      company_id :user.company_id,
   created_by :user._id
      // restrict_notification
    };

    const new_notification = await notification.create(article_data);

    return res.status(200).json({
      data: {
        message: `Notification created successfully.`,
        notification_id: new_notification._id,
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

module.exports = create_notification;
