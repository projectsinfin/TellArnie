const Company = require('../../models/Company');
const RegisteredKit = require('../../models/RegisteredKit');
const User = require('../../models/User');

// POST route to fetch kit details along with related products
const fetch_kits = async (req, res) => {
  try {
    const { userId } = req.user;

    // Validate userId
    if (!userId) {
      throw new Error("User ID not found in request");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Find registered kits filtering by company_id and excluding empty company_id values
    const kits = await RegisteredKit.find({ 
      is_dump: false, 
      company_id: { $ne: "" } 
    }, 'product_name product_code company_id kit_picture model_number status area location_name')
    .sort({ registered: -1 })
    .lean();

    if (!kits || kits.length === 0) {
      return res.status(404).json({
        message: "No kits found",
        status: 404
      });
    }

    // Extract all unique company_ids from the fetched kits
    const companyIds = kits.map(kit => kit.company_id);

    // Fetch details of companies using the extracted company_ids
    const companies = await Company.find({ _id: { $in: companyIds } });

    // Map company details to an object for quick lookup
    const companyMap = {};
    companies.forEach(company => {
      companyMap[company._id.toString()] = {
        company_name: company.company_name,
        industry: company.industry
      };
    });

    // Populate company details into kits
    const kitsWithCompanyDetails = kits.map(kit => {
      const companyDetails = companyMap[kit.company_id] || {};
      return {
        ...kit,
        company_name: companyDetails.company_name || "",
        industry: companyDetails.industry || ""
      };
    });

    res.status(200).json({
      data: {
        kits: kitsWithCompanyDetails
      },
      message: `Kit details and related products found successfully.`,
      status: 200
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching kit details:', error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetch_kits;
