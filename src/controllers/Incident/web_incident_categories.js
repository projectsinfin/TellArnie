const IncidentCategories = require("../../models/IncidentCategories");

// POST route to add an incident
const web_incident_categories = async (req, res) => {
  try {
    // Fetch all conditions from the database
    const Incidents = await IncidentCategories.find(
      {},
      { _id: 0, name: 1, description: 1 }
    );

    res.status(200).json({
      data: {
        Incidents: Incidents
      },
      message: `Incident categories found successfully.`,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ data: null, status: 500, message: error });
  }
};

module.exports = web_incident_categories;
