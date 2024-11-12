const Company = require("../../models/Company");
const Incident = require("../../models/Incident");
const RegisteredKit = require("../../models/RegisteredKit");
const User = require("../../models/User");

const web_dashboard_details = async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch user data
    const user = await User.findById(userId);

    // Get total user count
    const totalUserCount = await User.countDocuments();

    const userRegistrationData = await User.aggregate([
      {
        $group: {
          _id: { $month: "$account_creation" }, // Using account_creation field
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

     // Calculate percentage change in user registration
     const currentMonthIndex = userRegistrationData.findIndex(
      (data) => data._id === new Date().getMonth() + 1
    );

    let userPercentCount = 0;
    if (currentMonthIndex > 0) {
      const currentCount = userRegistrationData[currentMonthIndex].count;
      const previousCount = userRegistrationData[currentMonthIndex - 1].count;
      userPercentCount = ((currentCount - previousCount) / previousCount) * 100;
    }


    // Fetch all companies
    const companies = await Company.find(
      {},
      "company_name account_creation distributor_email"
    ).sort({ account_creation: -1 });

    // Fetch registeredKitCompany data
    const registeredKitCompany = await RegisteredKit.aggregate([
      {
        $match: {
          is_dump: false, // Filter out dumped kits
          company_id: { $ne: null }, // Ensure company_id is not null
        },
      },
      {
        $group: {
          _id: "$company_id",
          compliantCount: {
            $sum: { $cond: [{ $eq: ["$status", "compliant"] }, 1, 0] },
          },
          nonCompliantCount: {
            $sum: { $cond: [{ $eq: ["$status", "non_compliant"] }, 1, 0] },
          },
          expiryCount: {
            $sum: { $cond: [{ $lte: ["$expiry", new Date()] }, 1, 0] },
          },
        },
      },
    ]);

    const registeredFirstAiders = await User.aggregate([
      {
        $match: {
          is_firstaid_certified: true, // Filter out dumped kits
          company_id: { $ne: null }, // Ensure company_id is not null
        },
      },
      {
        $group: {
          _id: "$company_id",
          registeredFirstAidersCount: {
            $sum: {
              $cond: [{ $eq: ["$is_firstaid_certified", "true"] }, 1, 0],
            },
          },
          FirstAiderexpireSoon: {
            $sum: {
              $cond: [
                { $lte: ["$firstaid_certificate_date", new Date()] },
                1,
                0,
              ],
            },
          },
          FirstAiderexpired: {
            $sum: { $cond: [{ $lte: ["$expiry", new Date()] }, 1, 0] },
          },
        },
      },
    ]);

    // Map through companies and add registeredKitCompany data to each company
    const formattedCompanies = await Promise.all(
      companies.map(async (company) => {
        // Find corresponding registeredKitCompany data for the current company
        const companyRegisteredKitData = registeredKitCompany.find(
          (data) => data._id.toString() === company._id.toString()
        );

        // Extract counts or default to 0 if no data found
        const compliantCount = companyRegisteredKitData
          ? companyRegisteredKitData.compliantCount
          : 0;
        const nonCompliantCount = companyRegisteredKitData
          ? companyRegisteredKitData.nonCompliantCount
          : 0;
        const expiryCount = companyRegisteredKitData
          ? companyRegisteredKitData.expiryCount
          : 0;

        const registeredFirstAidersData = registeredFirstAiders.find(
          (data) => data._id.toString() === company._id.toString()
        );

        const RfaCount = registeredFirstAidersData
          ? registeredFirstAidersData.registeredFirstAidersCount
          : 0;
        const RfaSoon = registeredFirstAidersData
          ? registeredFirstAidersData.FirstAiderexpireSoon
          : 0;
        const RfaExpired = registeredFirstAidersData
          ? registeredFirstAidersData.FirstAiderexpired
          : 0;

        // Count users belonging to the current company
        const userCount = await User.countDocuments({
          company_id: company._id,
        });

        return {
          _id: company._id,
          company_name: company.company_name,
          account_creation: company.account_creation,
          distributor_email: company.distributor_email,
          userCount,
          compliantCount,
          nonCompliantCount,
          expiryCount,
          RfaCount,
          RfaSoon,
          RfaExpired,
        };
      })
    );

    const incidentData = await Incident.countDocuments();

    const incidentchart = await Incident.aggregate([
      {
        $group: {
          _id: { $month: "$account_creation" }, // Using account_creation field
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    const registeredKitData = await RegisteredKit.countDocuments({
      is_dump: false,
      company_id: { $ne: "" },
    });

    const registeredKitchart = await RegisteredKit.aggregate([
      {
        $match: { is_dump: false, company_id: { $ne: "" } }, // Filter where is_dump is false
      },
      {
        $group: {
          _id: { $month: "$registered" }, // Using registered field
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    const companyData = await Company.countDocuments();

    const companyRegistrationData = await Company.aggregate([
      {
        $group: {
          _id: { $month: "$account_creation" }, // Using account_creation field
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Calculate percentage change in company registrations
    const currentCurrentMonthIndex = companyRegistrationData.findIndex(
      (data) => data._id === new Date().getMonth() + 1
    );

    let CompanyPercentCount = 0;
    if (currentCurrentMonthIndex > 0) {
      const currentCompCount = companyRegistrationData[currentCurrentMonthIndex].count;
      const previousCompCount = companyRegistrationData[currentCurrentMonthIndex - 1].count;
      CompanyPercentCount = ((currentCompCount - previousCompCount) / previousCompCount) * 100;
    }

    const filterCriteria = {
      is_dump: false,
      company_id: { $ne: "" },
      brand: "Reliance Medical", // Filter for "Reliance Medical" brand
    };

    // Aggregate pipeline for "Reliance Medical" count
    const relianceMedicalCount = await RegisteredKit.aggregate([
      { $match: filterCriteria },
      {
        $group: {
          _id: { $month: "$registered" }, // Group by month of registration
          count: { $sum: 1 }, // Count occurrences
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    // Total count of RegisteredKit excluding "Reliance Medical"
    const otherBrandCount = await RegisteredKit.aggregate([
      {
        $match: {
          ...filterCriteria,
          brand: { $ne: "Reliance Medical" }, // Filter for all other brands
        },
      },
      {
        $group: {
          _id: { $month: "$registered" }, // Group by month of registration
          count: { $sum: 1 }, // Count occurrences
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    const SafetyKitCount = relianceMedicalCount.map((relianceData, index) => {
      const otherData = otherBrandCount[index];
      const relianceCount = relianceData.count;
      const otherCount = otherData ? otherData.count : 0;
      const total = relianceCount + otherCount;
      const reliancePercentage = (relianceCount / total) * 100 || 0; // Calculate percentage

      const currentCount = relianceData.count;
      const previousCount =
        index > 0 ? relianceMedicalCount[index - 1].count : 0;

      // Calculate percentage change
      const percentageChange =
        previousCount !== 0
          ? ((currentCount - previousCount) / previousCount) * 100
          : 0;

      return {
        month: relianceData._id,
        relianceCount,
        otherCount,
        reliancePercentage,
        percentageChange,
      };
    });
    res.status(200).json({
      data: {
        totalUserCount,
        userRegistrationData,
        company: formattedCompanies,
        incidentData,
        incidentchart,
        registeredKitData,
        registeredKitchart,
        companyData,
        companyRegistrationData,
        SafetyKitCount,
        userPercentCount,
        CompanyPercentCount
      },
      message: `Dashboard details fetched successfully.`,
      status: 200,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching dashboard details:", error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message,
    });
  }
};

module.exports = web_dashboard_details;
