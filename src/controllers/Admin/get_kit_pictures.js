const RegisteredKit = require("../../models/RegisteredKit");
const RiskCalculate = require("../../models/RiskCalculate");

const get_kit_pictures = async (req, res) => {
  try {
    const mainKit = req.body.mainKit;
    const recommendedKits = req.body.recommendedKits;
    const riskLevel = req.body.risk_level;
    const total_person = req.body.total_person;

    // Find kit pictures based on product_codes
    const mainKitData = await RegisteredKit.find({ product_code: { $in: mainKit }, is_dump: true });
    const recommendedKitsData = await RegisteredKit.find({ product_code: { $in: recommendedKits }, is_dump: true });

    if (!mainKitData || mainKitData.length === 0) {
      return res.status(404).json({
        message: "No kits found for the provided product codes.",
        status: 404,
      });
    }

    const mainKitQuantity = await RiskCalculate.find({
      product_code: { $in: mainKit },
      risk_level: riskLevel,
    });

    const recommendedKitQuantity = await RiskCalculate.find({
      product_code: { $in: recommendedKits },
      risk_level: riskLevel,
    });

    console.log('mainKitQuantity--', mainKitQuantity);
    console.log('recommendedKitQuantity--', recommendedKitQuantity);

    // Process main kits
    const main = mainKitData.map((kit) => {
      // Find the corresponding quantity entry for this product_code
      const quantityEntry = mainKitQuantity.find((entry) => entry.product_code === kit.product_code);
      let quantity = 1; // default quantity

      if (quantityEntry) {
        if (quantityEntry.action === 'div') {
          quantity = Math.ceil(total_person / quantityEntry.action_number);
        } else if (quantityEntry.action === 'multi') {
          quantity = Math.ceil(total_person * quantityEntry.action_number);
        }
      }

      return {
        product_code: kit.product_code,
        kit_picture: kit.kit_picture,
        product_name: kit.product_name,
        quantity: quantity,
      };
    });

    // Process recommended kits
    const recommended = recommendedKitsData.map((reckit) => {
      // Find the corresponding quantity entry for this product_code
      const quantityEntry = recommendedKitQuantity.find((entry) => entry.product_code === reckit.product_code);
      let quantity = 1; // default quantity

      if (quantityEntry) {
        if (quantityEntry.action === 'div') {
          quantity = Math.ceil(total_person / quantityEntry.action_number);
        } else if (quantityEntry.action === 'multi') {
          quantity = Math.ceil(total_person * quantityEntry.action_number);
        }
      }

      return {
        product_code: reckit.product_code,
        kit_picture: reckit.kit_picture,
        product_name: reckit.product_name,
        quantity: quantity,
      };
    });

    res.status(200).json({
      message: "Kit pictures retrieved successfully.",
      data: { main, recommended },
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500,
    });
  }
};

module.exports = get_kit_pictures;
