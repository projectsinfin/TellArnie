const RegisteredKit = require("../../models/RegisteredKit");
const Product = require("../../models/Product");
const Location = require("../../models/Location");
const Company = require("../../models/Company");
const User = require("../../models/User");

// POST route to fetch kit details along with related products
const fetch_kit_details = async (req, res) => {
  try {
    const { qr_code } = req.query;

    const { userId } = req.user;
    const user = await User.findById(userId);

    console.log(qr_code);

    // Fetch the kit based on the provided qr_code
    const kit = await RegisteredKit.findOne(
      { qr_code: qr_code },
      "product_name company_id kit_picture kit_ref_id brand model_number batch_number lot_number expiry_date area location_id kit_location_pic product_code is_dump is_empty"
    );

    const company = await Company.findById(user.company_id);

    if (!kit) {
      return res.status(200).json({
        data: {
          kit: null,
          kit_found: false,
          qr_code: qr_code,
        },
        message: "Kit not found",
        status: 200,
      });
    }

    const location = await Location.findById(kit.location_id);


const responseKit = {
  ...kit.toObject(), // Destructure existing kit properties
  productFound: kit.company_id ? true : false, // Set productFound based on company_id
  kit_found: true, // Add temporary flag
  location_name: location ? location.location_name : null,
  longitude: location ? location.longitude : null,
  latitude: location ? location.latitude : null,
};

    const relatedProducts = await Product.find(
      { kit_id: kit._id, is_dump: false },
      "kit_id brand description quantity current_quantity expiry_date product_code"
    );

    let relatedfindProducts = [];

    if (kit.kit_ref_id && kit.is_dump == true) {
      relatedfindProducts = await Product.find(
        { kit_id: kit.kit_ref_id, is_dump: true },
        "kit_id brand description quantity current_quantity expiry_date product_code"
      );
    }

    const allRelatedProducts = [...relatedProducts, ...relatedfindProducts];

    res.status(200).json({
      data: {
        kit: responseKit,
        relatedProducts: allRelatedProducts ? allRelatedProducts : null,
      },
      message: `Kit details and related products found successfully.`,
      status: 200,
      valid_qr: true,
      qr_code: qr_code,
      distributor_name: company.distributor_name,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching kit details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_kit_details;
