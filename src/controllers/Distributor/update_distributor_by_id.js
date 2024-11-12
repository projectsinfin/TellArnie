const Distributor = require("../../models/Distributor");
const Validation = require("../../utils/Validation");
const config = require("../../../config/config");

const update_distributor_by_id = async (req, res) => {
  try {
    const { SERVER_BASE_URL } = config;

    const {
      distributor_id, // Assuming distributor ID is provided in the request body
      distributor_name,
      street,
      county,
      country,
      email,
      postal_code,
      country_code,
      contact_number,
      alternate_distributor_name,
      role
    } = req.body;

    if (!distributor_id) {
      return res.status(400).json({
        status: 400,
        message: "Distributor ID is required."
      });
    }

    // Custom validation
    const errors = [];
    if (email && !Validation().email(email)) errors.push("Valid email is required.");

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        message: errors.join(" ")
      });
    }

    // Find distributor by ID
    const distributor = await Distributor.findById(distributor_id);
    if (!distributor) {
      return res.status(404).json({
        status: 404,
        message: "Distributor not found."
      });
    }

    // Check if email already exists in another distributor
    if (email) {
      const existingDistributor = await Distributor.findOne({ email, _id: { $ne: distributor_id } });
      if (existingDistributor) {
        return res.status(400).json({
          status: 400,
          message: "Email already exists."
        });
      }
    }

    // Update distributor data
    if (distributor_name) distributor.distributor_name = distributor_name;
    if (street) distributor.street = street;
    if (county) distributor.county = county;
    if (country) distributor.country = country;
    if (email) distributor.email = email;
    if (postal_code) distributor.postal_code = postal_code;
    if (country_code) distributor.country_code = country_code;
    if (contact_number) distributor.contact_number = contact_number;
    if (alternate_distributor_name) distributor.alternate_distributor_name = alternate_distributor_name;
    if (role) distributor.role = role;

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === "company_logo") {
          distributor.company_logo = `${SERVER_BASE_URL}company_logo_pictures/${file.filename}`;
        }
        if (file.fieldname === "company_white_logo") {
          distributor.company_white_logo = `${SERVER_BASE_URL}company_white_logo_pictures/${file.filename}`;
        }
      });
    }

    // Save updated distributor
    const updatedDistributor = await distributor.save();

    return res.status(200).json({
      data: {
        distributor: updatedDistributor,
        message: "Distributor updated successfully"
      },
      status: 200
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      status: 500,
      message: error.message
    });
  }
};

module.exports = update_distributor_by_id;
