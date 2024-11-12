const KitLocation = require("../../models/KitLocation");
const Location = require("../../models/Location");
const User = require("../../models/User");

// PUT route to update a location by ID
const update_location_by_id = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    //const locationId = req.params.id; // Extract location ID from request parameters

    const {
      location_id,
      location_name,
      longitude,
      latitude,
      street,
      city,
      county,
      country,
      zip_code,
      business_email,
      country_code,
      contact_number,
      assigned_admin_id,
      assigned_approver_id,
    } = req.body;

    const location_data = {};

    if (location_name) {
      location_data.location_name = location_name;
    }

    if (longitude) {
      location_data.longitude = longitude;
    }
    if (latitude) {
      location_data.latitude = latitude;
    }

    if (business_email) {
      location_data.business_email = business_email;
    }

    if (street) {
      location_data.street = street;
    }

    if (city) {
      location_data.city = city;
    } else {
      return res.status(400).json({
        status: 400,
        message: "City is required.",
      });
    }

    if (county) {
      location_data.county = county;
    } else {
      return res.status(400).json({
        status: 400,
        message: "County is required.",
      });
    }

    if (country) {
      location_data.country = country;
    } else {
      return res.status(400).json({
        status: 400,
        message: "Country is required.",
      });
    }

    if (zip_code) {
      location_data.zip_code = zip_code;
    }

    if (country_code && contact_number) {
      location_data.telephone = `${country_code} ${contact_number}`;
    }

    if (assigned_admin_id) {
      location_data.assigned_admin_id = assigned_admin_id;
    }

    if (assigned_approver_id) {
      location_data.assigned_approver_id = assigned_approver_id;
    }

    location_data.company_id = user.company_id;

    // Update the location by ID
    const updated_location = await Location.findByIdAndUpdate(
      location_id,
      location_data,
      { new: true }
    );

    if (!updated_location) {
      return res.status(404).json({
        status: 404,
        message: "Location not found.",
      });
    }

    res.status(200).json({
      message: "Location updated successfully.",
      location: updated_location,
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

module.exports = update_location_by_id;
