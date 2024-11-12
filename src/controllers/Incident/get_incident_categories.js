const IncidentCategories = require("../../models/IncidentCategories");
const Location = require("../../models/Location");
const User = require("../../models/User");

// POST route to add an incident
const get_incident_categories = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        data: null,
        message: "User not found",
        status: 404
      });
    }

    const locations = await Location.find({ company_id: user.company_id }, { _id: 1 , location_name: 1});

    // Fetch all conditions from the database
    const Incidents = await IncidentCategories.find(
      {},
      { _id: 0, name: 1, description: 1 }
    );

    res.status(200).json({
      data: {
        Incidents: Incidents,
        locations: locations
      },
      message: `Incident categories found successfully.`,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ data: null, status: 500, message: error });
  }
};

module.exports = get_incident_categories;
