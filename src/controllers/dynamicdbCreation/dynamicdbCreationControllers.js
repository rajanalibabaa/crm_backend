import Tenant from "../../models/dynamicdbCreation/dynamicdbCreationModel.js";
import { getTenantDB } from "../../utils/dynamicdbCreationTenant.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName, email, phoneNumber } = req.body;

    const dbName = `crm_${companyName.toLowerCase().replace(/\s/g, "_")}`;

    // Save tenant info in main DB
    const tenant = await Tenant.create({ companyName, email, dbName, phoneNumber });

    // Create the tenant database dynamically
    const db = await getTenantDB(dbName);

    // Optional: create first collection
    await db.createCollection("crm_main_users_collection");

    res.status(201).json({
      success: true,
      message: `Database created for ${companyName}`,
      dbName
    });
  } catch (error) {
    console.error("❌ Error creating tenant:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
