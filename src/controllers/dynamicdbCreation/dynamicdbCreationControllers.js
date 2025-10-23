// controllers/dynamicdbCreation/registerCompanyController.js
import Tenant from "../../models/dynamicdbCreation/dynamicdbCreationModel.js";
import { getTenantDB } from "../../utils/dynamicdbCreationTenant.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName, email, phoneNumber } = req.body;

    if (!companyName || !email || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingTenant = await Tenant.findOne({ email });
    if (existingTenant) {
      return res.status(400).json({ success: false, message: "Tenant with this email already exists" });
    }

    const clusterBase = "mongodb+srv://rajanalibabaa:LJkzt84ulD3yb74A@mrfranchise.vanempq.mongodb.net";
    const dbName = `crm_${companyName.toLowerCase().replace(/\s/g, "_")}_${Date.now()}`;
    const mongoURI = `${clusterBase}/${dbName}?retryWrites=true&w=majority&tls=true&appName=maincrm`;

    // Save tenant info
    const tenant = await Tenant.create({ companyName, email, phoneNumber, dbName, mongoURI });

    // Connect tenant DB (no collection creation)
    await getTenantDB(dbName);

    res.status(201).json({
      success: true,
      message: `Tenant registered successfully for ${companyName}`,
      dbName,
      mongoURI,
      tenantId: tenant._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
