const Article = require("../../models/Article");
const User = require("../../models/User");

const get_notifcation_by_id = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        data: null,
        status: 404,
        message: "User not found",
      });
    }
    const { id } = req.params;

    // Retrieve notifications for the user's company
    const notification = await Article.findById(id,'publish_on featured_image category title content' );

    // // Extract specific fields and add type for notifications
    // const formattedNotifications = notifications.map(notification => ({
    //   publish_on: notification.publish_on,
    //   category: notification.category,
    //   title: notification.title,
    // }));

    return res.status(200).json({
      data: notification,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};


module.exports = get_notifcation_by_id;
