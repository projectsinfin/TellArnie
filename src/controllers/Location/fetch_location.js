const Company = require('../../models/Company');
const Distributor = require('../../models/Distributor');
const Location = require('../../models/Location');
const User = require('../../models/User');

const fetch_location = async (req, res) => {
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

    const company = await Company.findById(user.company_id, { company_id: 1, company_name: 1,distributor_email:1 });

    const salesRepresentatives = await Distributor.find(
      { email:  company.distributor_email},
       "_id  distributor_name email contact_number country_code role company_logo"
    );

    const formattedSalesRepresentatives = salesRepresentatives.map(salesRepresentative => ({
      ...salesRepresentative.toObject(),
      phone: salesRepresentative.country_code + ' ' + salesRepresentative.contact_number,
    }));

    // Create an array to hold the merged location data
    const mergedLocations = [];

    if (locations.length > 0) {
      // Iterate through each location to fetch and add admin and approver names
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        const admin = await User.findById(location.assigned_admin_id);
        const approver = await User.findById(location.assigned_approver_id);

        // Add assigned admin and approver names to the location object
        const mergedLocation = {
          ...location.toObject(),
          assigned_admin_name: admin ? admin.first_name + ' ' + admin.last_name : null,
          assigned_approver_name: approver ? approver.first_name + ' ' + approver.last_name : null
        };

        mergedLocations.push(mergedLocation);
      }

      res.status(200).json({
        message: "Locations found successfully.",
        company: company,
        salesRepresentatives: formattedSalesRepresentatives,
        locations: mergedLocations,
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

module.exports = fetch_location;
