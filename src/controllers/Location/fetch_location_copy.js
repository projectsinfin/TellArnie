const Company = require('../../models/Company');
const Location = require('../../models/Location');
const User = require('../../models/User');

const fetch_location_copy = async (req, res) => {
  try {
    // Fetch user details based on user ID
    const { userId } = req.user;
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if user has company ID
    if (!user.company_id) {
      return res.status(404).json({ error: "User does not belong to any company." });
    }

    // Fetch locations based on company ID
    const locations = await Location.find({ company_id: user.company_id });

    const company = await Company.findById(user.company_id, { company_id: 1, company_name: 1 });

    const salesRepresentatives = await User.find(
      { company_id: user.company_id, assigned_role: "salesrepresentative" },
       "_id company_id first_name last_name email contact_number country_code assigned_role"
    );


    const formattedsalesRepresentatives = salesRepresentatives.map(salesRepresentatives => ({
      ...salesRepresentatives.toObject(),
      full_name: salesRepresentatives.first_name + ' ' + salesRepresentatives.last_name,
      phone: salesRepresentatives.country_code + ' ' + salesRepresentatives.contact_number,
    }));


  

    if (locations.length > 0) {
      // Iterate through each location to fetch and add admin and approver names
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        const admin = await User.findById(location.assigned_admin_id);
        const approver = await User.findById(location.assigned_approver_id);

        // Add assigned admin and approver names to the location object
        location.assigned_admin_name = admin ? admin.first_name + ' ' + admin.last_name : null;
        location.assigned_approver_name = approver ? approver.first_name + ' ' + approver.last_name : null;
      }

      res.status(200).json({
        message: "Locations found successfully.",
        company: company,
        salesRepresentatives: formattedsalesRepresentatives,
        locations: locations,
        status: 200
      });
    } else {
      res.status(404).json({ error: "No locations found for the user's company." });
    }

  } catch (error) {
    // Handle errors
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_location_copy;
