const Company = require('../../models/Company');
const Location = require('../../models/Location');
const User = require('../../models/User');
const RegisteredKit = require('../../models/RegisteredKit');
const Product = require('../../models/Product');

const fetch_location_kits = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!user.company_id) {
      return res.status(404).json({ error: "User does not belong to any company." });
    }

    const locations = await Location.find({ company_id: user.company_id });

    if (!locations || locations.length === 0) {
      return res.status(404).json({ error: "No locations found for the user's company." });
    }

    const locationsWithKits = [];

    for (const location of locations) {
      const kits = await RegisteredKit.find({ location_id: location._id });

      const kitsWithStatus = await Promise.all(kits.map(async kit => {
        const products = await Product.find({ kit_id: kit._id });
        const today = new Date();
        const nearExpiryDate = new Date();
        nearExpiryDate.setDate(today.getDate() + 90);

        let status = kit.current_quantity < kit.quantity ? "non_compliant" : "compliant";

        const kitExpiryDate = new Date(kit.expiry_date);

        if (kitExpiryDate < nearExpiryDate) {
          status = "near_expiry";
        }

        for (const product of products) {
          if (product.expiry_date) {  // Check if expiry_date is not null or empty
            if (new Date(product.expiry_date) < today) {
              status = "non_compliant";
              break;
            }
          }
        }

        return {
          kit_id: kit._id,
          product_name: kit.product_name,
          qr_code: kit.qr_code,
          status: status,
          lot_number: kit.lot_number,
          product_code: kit.product_code,
          area: kit.area,
          is_assessment: kit.is_assessment
        };
      }));

      const locationWithKits = {
        _id: location._id,
        name: location.location_name,
        kits: kitsWithStatus
      };

      locationsWithKits.push(locationWithKits);
    }

    const response = {
      message: "Locations and associated kits found successfully.",
      locations: locationsWithKits,
      status: 200
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching locations and kits:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_location_kits;
