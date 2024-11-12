const Product = require('../../models/Product');
const RegisteredKit = require('../../models/RegisteredKit');

// POST route to fetch kit details along with related products
const fetch_qr_image = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id)

    // Fetch the kit based on the provided qr_code
    const kit_data = await RegisteredKit.findOne(
      { 'qr_code': id }, 'product_name description company_id kit_picture brand model_number batch_number lot_number expiry_date area location_id kit_location_pic location_name area'
    );

    if (!kit_data) {
      return res.status(200).json({
      
        kit_data: null,
        message: "Kit not found.Please download the below app link.",
        status: 200
      });
    }
    


    const relatedfindProducts = await Product.find(
      { 'kit_id': kit_data._id },
      'kit_id brand description quantity current_quantity product_picture expiry_date'
    );



    res.status(200).json({
        kit_data: kit_data,
        products: relatedfindProducts,
      message: `Kit found successfully.`,
      status: 200,
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching kit details:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_qr_image;
