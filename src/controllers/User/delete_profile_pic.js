const User = require("../../models/User");
const fs = require("fs");
const config = require("../../../config/config");

const delete_profile_pic = async (req, res) => {
  try {
    const { userId } = req.user;
    const { SERVER_BASE_URL } = config;
    const user = await User.findById(userId);

    async function deleteProfilePicture() {
      if (user.profile_pic) {
        const remaining_path = user.profile_pic.slice(SERVER_BASE_URL.length);

        fs.unlink(`uploads/${remaining_path}`, (err) => {
          if (err) {
            console.error("Error deleting the file:", err);
          } else {
            console.log("File deleted successfully");
          }
        });
      }
    }

    const delete_pic = await deleteProfilePicture();

    
    user.profile_pic = "";
    await user.save();

    res.status(200).json({
      message:"Image deleted successfully.",
      status: 200
    });
    
   
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};


module.exports = delete_profile_pic;

