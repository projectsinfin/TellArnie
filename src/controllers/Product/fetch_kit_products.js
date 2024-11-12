const RegisteredKit = require("../../models/RegisteredKit");
const Product = require("../../models/Product");
const Location = require("../../models/Location");

// POST route to fetch kit details along with related products
const fetch_kit_products = async (req, res) => {
  try {
    const { kit_ref_id } = req.query;

    // Fetch the kit based on the provided qr_code
    const kit = await RegisteredKit.findOne(
      { kit_ref_id: kit_ref_id, is_dump: true},
      "product_name kit_ref_id brand model_number"
    );

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

    // Set a temporary `kit_found` flag in the response objec

    const relatedProducts = await Product.find(
      { kit_id: kit.kit_ref_id, is_dump: true},
      "product_name   quantity product_code"
    );


    res.status(200).json({
      data: {
        kit: kit,
        relatedProducts: relatedProducts
      },
      message: `Kit details and related products found successfully.`,
      status: 200,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching kit details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_kit_products;
