const Incident = require('../../models/Incident');
const IncidentPeople = require('../../models/IncidentPeople');
const User = require('../../models/User');
const Product = require('../../models/Product');

// POST route to add an incident
const web_quick_incident = async (req, res) => {
  try {
    const {
      kit_id,
      first_name,
      last_name,
      country_code,
      contact_number,
      email,
      incident_date,
      incident_time,
      description,
      category_of_incident,
      classification,
      item_used
    } = req.body;


    // Create a new incident object
    const newIncident = new Incident({
      kit_id,
      user_id:"66276149f61cb4a6327e615c",
      incident_date,
      incident_time,
      category_of_incident,
      classification,
      description,
      item_used,
      // company_id:user.company_id,
      account_creation: new Date() // Set account_creation to current timestamp
    });

    // Save the new incident to the database
    const savedIncident = await newIncident.save();

    for (const item of item_used) {
      const { product_id, used_quantity, full_name , user_id, description} = item;

      // Retrieve the product from the database
      const product = await Product.findById(product_id);

      // Check if the product exists
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${product_id} not found.` });
      }

      // Check if used_quantity is less than or equal to quantity
      // if (used_quantity > product.current_quantity) {
      //   return res.status(400).json({ message: `Used quantity exceeds available quantity for product with ID ${product_id}.` });
      // }

      const current_quantity = product.current_quantity - used_quantity;

      // Update the product with the new used_quantity
      await Product.updateOne({ _id: product_id }, { current_quantity: current_quantity });

      // You can perform additional error handling or logging here if needed

      const IncidentPeopledata = new IncidentPeople({
        user_id,
        full_name,
        incident_id: savedIncident._id,
        company_id: 'user.company_id',
        description,
        injury_classification: classification,
        injury_type: category_of_incident
      });

      const savedIncidentPeopledata = await IncidentPeopledata.save();
    }

    res.status(200).json({
      data:{
        incident: savedIncident
      },
      message: "Incident added successfully.",
      status:200
    });
  } catch (error) {
    console.error("Error adding incident:", error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error,
    });
  }
};

module.exports = web_quick_incident;
