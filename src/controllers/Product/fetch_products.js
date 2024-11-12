const Product = require('../../models/Product');
const RegisteredKit = require('../../models/RegisteredKit');
const User = require('../../models/User');


// POST route to fetch kit details along with related products
const fetch_products = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    let products;

   

    console.log('user',user.assigned_role)

    if (user.assigned_role === "superadmin") {
      products = await RegisteredKit.find({is_dump : true}, 'product_name product_code description brand model_number kit_ref_id');
    } else {
      // Fetch registered kits and add random kits based on the given count
      products = await RegisteredKit.find({is_dump : true}, 'product_name description brand model_number product_code kit_ref_id kit_picture quantity');

    }

    res.status(200).json({
      data: {
        products: products
      },
      message: `Kit details and related products found successfully.`,
      status: 200
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching kit details:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_products;
