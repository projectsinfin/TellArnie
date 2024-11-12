const Article = require("../../models/Article");
const User = require("../../models/User");

const get_user_notifcations = async (req, res) => {
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

    const company_id = user.company_id;

    // Retrieve notifications for the user's company
    const notifications = await Article.find({},'publish_on featured_image category title sub_title content' ).sort({article_creation:-1});

    // // Extract specific fields and add type for notifications
    // const formattedNotifications = notifications.map(notification => ({
    //   publish_on: notification.publish_on,
    //   category: notification.category,
    //   title: notification.title,
    // }));

    return res.status(200).json({
      data: notifications,
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


module.exports = get_user_notifcations;
