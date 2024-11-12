const Incident = require('../../models/Incident');
const Kit = require('../../models/RegisteredKit');
const KitLocation = require('../../models/KitLocation'); // Import KitLocation model
const User = require('../../models/User');

// POST route to add an incident
const get_incident = async (req, res) => {
  try {
    
    const { id } = req.params
    
    // Fetch incident details from the database
    const incidentDetails = await Incident.findById(id);

    const user = await User.findById(incidentDetails.user_id,"first_name last_name  email contact_number country_code");

  

    // Extract kit_id from incident details
    const kitId = incidentDetails.kit_id;

  
    // Fetch kit details using kit_id
    const kitDetails = await Kit.findById(kitId, {
      product_name: 1,
      kit_picture: 1,
      location_id: 1,
      brand: 1,
      model_number: 1,
      batch_number: 1,
      lot_number: 1,
      expiry_date: 1,
      location_name: 1,
	product_code: 1,
      area:1,
      _id: 0 // Exclude _id field
    });

    res.status(200).json({
      data: {
        incident: incidentDetails,
        kit: kitDetails,
        reported_by:user
      },
      message: `Incidents found successfully.`,
      status:200
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching incident:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = get_incident;
