const Incident = require("../../models/Incident");
const IncidentPeople = require("../../models/IncidentPeople");
const config = require("../../../config/config");
const Product = require("../../models/Product");
const User = require("../../models/User");

// POST route to add an incident
const web_detailed_incident = async (req, res) => {
  try {
    const {
      kit_id,
      incident_date,
      incident_time,
      description,
      category_of_incident,
      classification,
      location_of_incident,
      area_of_incident,
      incident_pictures,
    } = req.body;

    const json_item_used = JSON.parse(req.body.item_used);

    const json_incident_person = JSON.parse(req.body.incident_person);

    const { SERVER_BASE_URL } = config;

    const { userId } = req.user;

    const user = await User.findById(userId);

    let picturesUrls = []; // Create an empty array to store picture URLs

    if (req.files && req.files.length > 0) {
      const incident_pic_names = req.files.map((file) => file.filename);
      picturesUrls = incident_pic_names.map(
        (filename) => `${SERVER_BASE_URL}incident_pictures/${filename}`
      );
    }

    // Create a new incident object
    const newIncident = new Incident({
      kit_id,
      user_id: userId,
      incident_date,
      incident_time,
      category_of_incident,
      classification,
      description,
      location_of_incident,
      area_of_incident,
      item_used: json_item_used,
      incident_pictures: picturesUrls,
      company_id: user.company_id,
      is_detailed_incident: true,
      account_creation: new Date(), // Set account_creation to current timestamp
    });

    // Save the new incident to the database
    const savedIncident = await newIncident.save();

    for (const item of json_item_used) {
      const { product_id, used_quantity } = item;

      // Retrieve the product from the database
      const product = await Product.findById(product_id);

      // Check if the product exists
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${product_id} not found.` });
      }

      // Check if used_quantity is less than or equal to quantity
      if (used_quantity > product.current_quantity) {
        return res.status(400).json({
          message: `Used quantity exceeds available quantity for product with ID ${product_id}.`,
          status:400
        });
      }

      const current_quantity = product.current_quantity - used_quantity;

      // Update the product with the new used_quantity
      await Product.updateOne(
        { _id: product_id },
        { current_quantity: current_quantity }
      );
    }

    for (const person of json_incident_person) {
      const {
        injury_type,
        injury_classification,
        injury_details,
        outcome,
        more_details,
        full_name,
        user_id,
      } = person;

      const IncidentPeopledata = new IncidentPeople({
        incident_id: savedIncident._id,
        company_id: user.company_id,
        user_id,
        full_name,
        injury_type,
        injury_details,
        injury_classification,
        outcome,
        more_details,
      });

      const savedIncidentPeopledata = await IncidentPeopledata.save();
    }
    res.status(200).json({
      data: {
        Incident: savedIncident,
      },
      message: "Incident added successfully.",
      status: 200,
    });
  } catch (error) {
    console.error("Error adding incident:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = web_detailed_incident;
