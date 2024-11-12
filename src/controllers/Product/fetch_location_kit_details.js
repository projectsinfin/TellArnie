const Company = require('../../models/Company');
const Location = require('../../models/Location');
const User = require('../../models/User');
const RegisteredKit = require('../../models/RegisteredKit');
const Product = require('../../models/Product');

const fetch_location_kit_details = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    const { kit_ids } = req.body;

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!user.company_id) {
      return res.status(404).json({ error: "User does not belong to any company." });
    }

    // Fetch kits based on provided kit_ids and the user's company location
    const kits = await RegisteredKit.find({
      _id: { $in: kit_ids }
      // Assuming the user's location ID is in user.location_id
    });

    const kitsWithStatus = await Promise.all(kits.map(async (kit) => {
      const products = await Product.find({ kit_id: kit._id });
      const today = new Date();

      let status = kit.current_quantity < kit.quantity ? "non_compliant" : "compliant";

      for (const product of products) {
        if (product.expiry_date) {
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
        is_assessment: kit.is_assessment,
        risk_level:"high",
        date:kit.registered
      };
    }));

    const response = {
      message: "Kits found successfully.",
      kits: kitsWithStatus,
      status: 200
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching kits:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_location_kit_details;
