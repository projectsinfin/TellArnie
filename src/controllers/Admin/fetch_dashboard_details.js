const Company = require("../../models/Company");
const Incident = require("../../models/Incident");
const IncidentPeople = require("../../models/IncidentPeople");
const RegisteredKit = require("../../models/RegisteredKit");
const User = require("../../models/User");

const fetch_dashboard_details = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    // Fetch company name
    const company = await Company.findById(user.company_id);

    const users_list = await User.find({ company_id: user.company_id });

    const firstAidCertifiedUsersCount = users_list.filter(
      (user) => user.is_firstaid_certified
    ).length;

    const currentDate = new Date();
    const expiryThreshold = new Date();

    // Fetch latest 3 incidents
    const incidents = await Incident.find({ company_id: user.company_id })
      .sort({ account_creation: -1 }) // Sort by date in descending order
      .limit(3); // Limit the results to 3

    const all_incidents = await Incident.find({ company_id: user.company_id });

    const incident_peoples = await IncidentPeople.find({ company_id: user.company_id });


    const nameCounts = {};
    incident_peoples.forEach(person => {
      const name = person.full_name;
      if (nameCounts[name]) {
        nameCounts[name]++;
      } else {
        nameCounts[name] = 1;
      }
    });

    // Transform the nameCounts object into an array of objects
    const nameCountsArray = Object.keys(nameCounts).map(name => ({
      full_name: name,
      count: nameCounts[name],
      rating:"Nominal"
    }));

    // Sort the array in descending order based on the count
    nameCountsArray.sort((a, b) => b.count - a.count);

    // Fetch registered kits
    const kits = await RegisteredKit.find({ company_id: user.company_id });

    // Count compliant and non-compliant kits
    let compliantCount = 0;
    let nonCompliantCount = 0;
    kits.forEach((kit) => {
      if (kit.quantity > kit.current_quantity) {
        nonCompliantCount++;
      } else {
        compliantCount++;
      }
    });

    let certificatesExpiringWithin90Days = 0;
    let expiredCertificatesCount = 0;
    users_list.forEach((user) => {
      if (user.firstaid_certificate_date) {
        const certificateExpiryDate = new Date(user.firstaid_certificate_date);
        const differenceInDays = Math.floor(
          (certificateExpiryDate.getTime() - currentDate.getTime()) /
            (1000 * 3600 * 24)
        );
        if (differenceInDays <= 90 && differenceInDays >= 0) {
          certificatesExpiringWithin90Days++;
        } else if (differenceInDays < 0) {
          expiredCertificatesCount++;
        }
      }
    });

    expiryThreshold.setDate(currentDate.getDate() + 90); // Calculate 90 days from current date

    let kitsExpiringWithin90Days = 0;
    kits.forEach((kit) => {
      if (kit.expiry_date) {
        const expiryDate = new Date(kit.expiry_date);
        if (expiryDate <= expiryThreshold) {
          kitsExpiringWithin90Days++;
        }
      }
    });

    const incidentCountsByDate = {};
    all_incidents.forEach((incident) => {
      // Extracting date part only
      const incidentDate = new Date(incident.account_creation)
        .toISOString()
        .split("T")[0];
      if (incidentCountsByDate[incidentDate]) {
        incidentCountsByDate[incidentDate]++;
      } else {
        incidentCountsByDate[incidentDate] = 1;
      }
    });

    // Transform incidentCountsByDate into the desired format
    const formattedIncidentCountsByDate = {
      incident_date: [],
      count: [],
    };
    Object.keys(incidentCountsByDate).forEach((date) => {
      formattedIncidentCountsByDate.incident_date.push(
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        })
      );
      formattedIncidentCountsByDate.count.push(incidentCountsByDate[date]);
    });

    // Find the latest detailed incident date
    let latestDetailedIncidentDate = null;
    incidents.forEach((incident) => {
      if (incident.is_detailed_incident && incident.account_creation) {
        const incidentDate = new Date(incident.account_creation);
        if (
          !latestDetailedIncidentDate ||
          incidentDate > latestDetailedIncidentDate
        ) {
          latestDetailedIncidentDate = incidentDate;
        }
      }
    });

    // Calculate the number of days from the latest detailed incident date to the current date
    let daysSinceLatestDetailedIncident = null;
    if (latestDetailedIncidentDate) {
      const currentDate = new Date();
      const differenceInTime =
        currentDate.getTime() - latestDetailedIncidentDate.getTime();
      daysSinceLatestDetailedIncident = Math.floor(
        differenceInTime / (1000 * 3600 * 24)
      );
    }

    // Find the latest incident date where is_detailed_incident is false
    let latestNonDetailedIncidentDate = null;
    incidents.forEach((incident) => {
      if (!incident.is_detailed_incident && incident.account_creation) {
        const incidentDate = new Date(incident.account_creation);
        if (
          !latestNonDetailedIncidentDate ||
          incidentDate > latestNonDetailedIncidentDate
        ) {
          latestNonDetailedIncidentDate = incidentDate;
        }
      }
    });

    // Calculate the number of days from the latest non-detailed incident date to the current date
    let daysSinceLatestNonDetailedIncident = null;
    if (latestNonDetailedIncidentDate) {
      const currentDate = new Date();
      const differenceInTime =
        currentDate.getTime() - latestNonDetailedIncidentDate.getTime();
      daysSinceLatestNonDetailedIncident = Math.floor(
        differenceInTime / (1000 * 3600 * 24)
      );
    }

    console.log(company, kits, incidents);

    res.status(200).json({
      data: {
        incident_peoples:incident_peoples,
        incidents: incidents,
        personal_risk_rating: nameCountsArray,
        firstAidCertifiedUsersCount: firstAidCertifiedUsersCount,
        compliantCount: compliantCount,
        nonCompliantCount: nonCompliantCount,
        daysSinceLatestDetailedIncident: daysSinceLatestDetailedIncident,
        daysSinceLatestNonDetailedIncident: daysSinceLatestNonDetailedIncident,
        kitsExpiringWithin90Days: kitsExpiringWithin90Days,
        incidentCountsByDate: formattedIncidentCountsByDate,
        certificatesExpiringWithin90Days: certificatesExpiringWithin90Days,
        expiredCertificatesCount: expiredCertificatesCount,
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
      message: error,
    });
  }
};

module.exports = fetch_dashboard_details;
