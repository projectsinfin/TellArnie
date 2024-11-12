const Incident = require('../../models/Incident');
const IncidentPeople = require('../../models/IncidentPeople');
const User = require('../../models/User');
const Product = require('../../models/Product');
const RegisteredKit = require('../../models/RegisteredKit');

const add_quick_incident = async (req, res) => {
  try {
    const {
      kit_id,
      incident_date,
      incident_time,
      description,
      category_of_incident,
      location_of_incident,
      area_of_incident,
      classification,
      item_used // This is now optional
    } = req.body;

    const { userId } = req.user;
    const user = await User.findById(userId);

    const registeredKit = await RegisteredKit.findById(kit_id);

    if (!registeredKit) {
      return res.status(404).json({ message: `Registered Kit with ID ${kit_id} not found.` });
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
      item_used,
      company_id: user.company_id,
      account_creation: new Date()
    });

    // Save the new incident to the database
    const savedIncident = await newIncident.save();

    // If item_used is provided, handle the product updates
    if (item_used && Array.isArray(item_used) && item_used.length > 0) {
      let totalUsedQuantity = 0;
      for (const item of item_used) {
        const { product_id, used_quantity, full_name, user_id, description } = item;

        // Retrieve the product from the database
        const product = await Product.findById(product_id);

        // Check if the product exists
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${product_id} not found.` });
        }

        // Check if used_quantity is less than or equal to quantity
        if (used_quantity > product.current_quantity) {
          return res.status(400).json({
            message: `Used quantity exceeds available quantity for product with ID ${product_id}.`
          });
        }

        // Calculate new current_quantity for the product
        const newCurrentQuantity = product.current_quantity - used_quantity;
        product.current_quantity = newCurrentQuantity;

        await product.save();

        // Update total used quantity
        totalUsedQuantity += used_quantity;

        // Create IncidentPeople data
        const incidentPeopleData = new IncidentPeople({
          user_id,
          full_name,
          incident_id: savedIncident._id,
          company_id: user.company_id,
          description,
          injury_classification: classification,
          injury_type: category_of_incident
        });

        await incidentPeopleData.save();
      }

      // Update RegisteredKit's current_quantity
      if (registeredKit.current_quantity >= totalUsedQuantity) {
        registeredKit.current_quantity -= totalUsedQuantity;
        await registeredKit.save();
      } 

      // Update RegisteredKit status to 'non_compliant'
      registeredKit.status = 'non_compliant';
      await registeredKit.save();
    }

    res.status(200).json({
      data: {
        incident: savedIncident
      },
      message: "Incident added successfully.",
      status: 200
    });
  } catch (error) {
    console.error("Error adding incident:", error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message
    });
  }
};

module.exports = add_quick_incident;
