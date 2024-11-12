const RegisteredKit = require("../../models/RegisteredKit");
const User = require("../../models/User");
const RiskAssessment = require("../../models/RiskAssessment");
const nodemailer = require("nodemailer");
const Company = require("../../models/Company");
const Product = require("../../models/Product");

const generate_quote = async (req, res) => {
  try {
    const { all_non_compliant, all_near_expiry, custom_item } = req.body;
    const { userId } = req.user;
    const user = await User.findById(userId);

    const kitsData = [];

    // Fetch the company details
    const company = await Company.findById(user.company_id);

    // Fetch RiskAssessment model data where is_quote_generated is false
    const riskAssessment = await RiskAssessment.findOne({
      company_id: user.company_id,
      is_quote_generated: false,
    });

    if (!riskAssessment) {
      return res.status(404).json({
        message: "Risk assessment not found.",
        status: 404,
      });
    }

    // Fetch expired kits
    const expiredKits = await RegisteredKit.find({
      company_id: user.company_id,
      expiry_date: { $lt: new Date() },
    });

    kitsData.push(...expiredKits);

    const expiredKitIds = expiredKits.map((kit) => kit._id);

    // Fetch all unexpired kits
    const allUnexpiredKits = await RegisteredKit.find({
      company_id: user.company_id,
      _id: { $nin: expiredKitIds },
    });

    const unexpiredKitIds = allUnexpiredKits.map((kit) => kit._id);

    // Fetch non-compliant items if requested
    if (all_non_compliant) {
      const nonCompliantItems = await Product.find({
        kit_id: { $in: unexpiredKitIds },
        $expr: { $lt: ["$current_quantity", "$quantity"] },
      });
      kitsData.push(...nonCompliantItems);
    }

    // Fetch near-expiry items if requested
    if (all_near_expiry) {
      const today = new Date();
      const ninetyDaysLater = new Date(today);
      ninetyDaysLater.setDate(today.getDate() + 90);

      const nearExpiryKits = await Product.find({
        kit_id: { $in: unexpiredKitIds },
        expiry_date: { $gte: today, $lte: ninetyDaysLater },
      });
      kitsData.push(...nearExpiryKits);
    }

    // Add custom items to kitsData
    if (custom_item && custom_item.length > 0) {
      kitsData.push(
        ...custom_item.map((item) => ({
          product_name: item.product,
          quantity: item.quantity,
        }))
      );
    }

    // Generate table rows for kitsData
    const tableRows = kitsData
      .map(
        (kit) => `
        <tr>
          <td>${kit.product_name || kit.product}</td>
          <td>${kit.product_code || ""}</td>
          <td>${kit.quantity - kit.current_quantity || ""}</td>
        </tr>
      `
      )
      .join("");

    // Generate table rows for mainKit from RiskAssessment
    const mainKitRows = riskAssessment.mainKit
      .map(
        (kit) => `
        <tr>
          <td>${kit.product_name}</td>
          <td>${kit.product_code}</td>
          <td>${kit.quantity}</td>
        </tr>
      `
      )
      .join("");

    // Generate table rows for recommendedKits from RiskAssessment
    const recommendedKitRows = riskAssessment.recommendedKits
      .map(
        (kit) => `
        <tr>
          <td>${kit.product_name}</td>
          <td>${kit.product_code}</td>
          <td>${kit.quantity}</td>
        </tr>
      `
      )
      .join("");

    // Create the full email content
    const emailContent = `
      <p>Dear ${user.first_name} ${user.last_name},</p>
      <p>Quote generated successfully. Please find the product details below:</p>

      <h3>Products (Non-Compliant, Near Expiry, Custom Items)</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Code</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <h3>Main Kit</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Code</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${mainKitRows}
        </tbody>
      </table>

      <h3>Recommended Kits</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Code</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${recommendedKitRows}
        </tbody>
      </table>

      <p>Best regards,<br/>Your Company</p>
    `;

    // Fetch approver and sales representative emails
    const [approver, salesRep] = await Promise.all([
      User.findOne({ company_id: user.company_id, assigned_role: "approver" }),
      company.distributor_email,
    ]);

    // Create the email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "noreply@tellarnie.com",
        pass: "Ng$`+p-;bdhJt~S4E.cvGwBr*{W=8[ZDHsQ5^FK(]?2U!A3fYz",
      },
    });

    // Prepare email options
    let toEmails = [user.email];
    if (approver) {
      toEmails.push(approver.email);
    }
    if (salesRep) {
      toEmails.push(salesRep.email);
    }

    const mailOptions = {
      from: "noreply@tellarnie.com",
      to: toEmails,
      subject: `A new Quote is generated by ${user.first_name} ${user.last_name}`,
      html: emailContent,
      attachments: [
        {
          filename: "kitsData.json",
          content: JSON.stringify(kitsData, null, 2),
        },
      ],
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Mark the RiskAssessment as having a quote generated
    riskAssessment.is_quote_generated = true;
    await riskAssessment.save();

    return res.status(200).json({
      data: kitsData,
      message: "Quote generated successfully. Email sent.",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: null,
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = generate_quote;
