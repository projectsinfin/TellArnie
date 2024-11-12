const RiskAssessment = require("../../models/RiskAssessment");
const User = require("../../models/User");

const update_risk_assessment = async (req, res) => {
  try {
    const {
      is_assessment,
      area,
      location_id,
      location_name,
      mainKit,
      recommendedKits,
    } = req.body;

    // Fetch user details based on user ID
    const { userId } = req.user;
    const user = await User.findById(userId);

    // Construct the update object
    const update = {
      user_id:userId,
      company_id:user.company_id,
      is_assessment,
      area,
      location_id,
      location_name,
      mainKit,        // Save the mainKit array of objects
      recommendedKits // Save the recommendedKits array of objects
    };

    // Find the document by ID and update it
    const updatedRiskAssessment = await RiskAssessment.create(
      update
    );

    if (!updatedRiskAssessment) {
      return res.status(404).json({
        message: "Risk assessment not found.",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Risk assessment updated successfully.",
      status: 200,
      updatedRiskAssessment: updatedRiskAssessment // Optionally, you can send the updated document back in the response
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      status: 500,
    });
  }
};

module.exports = update_risk_assessment;
