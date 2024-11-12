const Product = require('../../models/Product');

// POST route to fetch kit details along with related products
const fetch_product = async (req, res) => {
  try {
    const { barcode, kit_id } = req.query;

    console.log(req.query);

    // Fetch the matched product based on barcode and is_dump field
    const matched_product = await Product.findOne({ barcode: barcode, is_dump: true });

    // Check if matched product exists
    if (!matched_product) {
      return res.status(200).json({
        is_product: false,
        message: `Product not found.`,
        status: 200
      });
    }

    let product;

    // Fetch product based on kit_id if provided
    if (kit_id) {
      product = await Product.find(
        { product_code: matched_product.product_code, kit_id: kit_id },
        'description current_quantity brand lot_number product_code'
      );
    } else {
      // Fetch product based on barcode
      product = await Product.find(
        { barcode: barcode, is_dump: true },
        'description current_quantity brand lot_number product_code'
      );
    }

    // Check if the product is found and send appropriate response
    if (product) {
      res.status(200).json({
        data: {
          product: product
        },
        is_product: true,
        message: `Product found successfully.`,
        status: 200
      });
    } else {
      res.status(200).json({
        is_product: false,
        message: `Product not found.`,
        status: 200
      });
    }

  } catch (error) {
    // Handle errors
    console.error('Error fetching kit details:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_product;
