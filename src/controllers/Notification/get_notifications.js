const Notification = require("../../models/Notifications");
const Article = require("../../models/Article");
const User = require("../../models/User");

const get_notifications = async (req, res) => {
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
    const notifications = await Notification.find({ company_id });

    // Retrieve articles for the user's company
    const articles = await Article.find({ company_id });

    // Extract specific fields and add type for notifications
    const formattedNotifications = notifications.map(notification => ({
      type: 'Notification',
      notification_id: notification._id,
      status: notification.status,
      publish_on: notification.publish_on,
      category: notification.category,
      title: notification.title,
      message:notification.message
    }));

    // Extract specific fields and add type for articles
    const formattedArticles = articles.map(article => ({
      type: 'Article',
      article_id: article._id,
      status: article.status,
      publish_on: article.publish_on,
      category: article.category,
      title: article.title,
      content: article.content,
    }));

    // Merge notifications and articles arrays
    const mergedList = [...formattedNotifications, ...formattedArticles];

    // Sort merged list by publish_on field
    mergedList.sort((a, b) => new Date(b.publish_on) - new Date(a.publish_on));

    return res.status(200).json({
      data: mergedList,
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


module.exports = get_notifications;
