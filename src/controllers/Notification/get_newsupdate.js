const Article = require("../../models/Article");
const User = require("../../models/User");

const get_newsupdate = async (req, res) => {
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

    // Retrieve articles for the user's company
    const articles = await Article.find({ status: "Scheduled", feature_article: "Yes" }).sort({ article_creation: -1 });

    // Separate latest article and remaining articles
    const latestNews = articles.length > 0 ? articles[0] : {};
    const oldNews = articles.length > 1 ? articles.slice(1) : [];

    return res.status(200).json({
      data: {
        latestNews,
        oldNews,
      },
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

module.exports = get_newsupdate;
