const Incident = require('../../models/Incident');
const User = require('../../models/User');

// POST route to add an incident
const get_incidents_list = async (req, res) => {
  try {

    const { userId } = req.user;
    const user = await User.findById(userId);

    const { search, start_date, end_date } = req.query;
    const searchQuery = { company_id: user.company_id }; 

    if (search) {
      searchQuery.$or = [
        { category_of_incident: { $regex: search, $options: "i" } }, // Case-insensitive title search
        { classification: { $regex: search, $options: "i" } }, // Case-insensitive description search
        { location_of_incident: { $regex: search, $options: "i" } }, // Case-insensitive speaker search
        { area_of_incident: { $regex: search, $options: "i" } }, 
      ];
    }

    if (start_date) {
      searchQuery.incident_date = { $gte: new Date(start_date) };
    }

    // Date filtering based on end date
    if (end_date) {
      if (!searchQuery.hasOwnProperty('incident_date')) {
        searchQuery.incident_date = {};
      }
      searchQuery.incident_date.$lte = new Date(new Date(end_date).getTime() + 24 * 60 * 60 * 1000);
    }

    // Fetch all incidents from the database based on the constructed query
    const Incidents = await Incident.find(searchQuery).sort({ account_creation: -1 });

    res.status(200).json({
      message: `Incidents found successfully.`,
      Incidents: Incidents,
      status: 200
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = get_incidents_list;
