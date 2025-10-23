// controllers/dynamicdbCreation/loginCompanyController.js
import Tenant from "../../models/dynamicdbCreation/dynamicdbCreationModel.js";
import { getTenantDB } from "../../utils/dynamicdbCreationTenant.js";

export const loginCompanyUser = async (req, res) => {
  try {
    const { email } = req.body;
    const tenant = await Tenant.findOne({ email });
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant not found" });

    const db = await getTenantDB(tenant.dbName);

    // Access collection dynamically
    const leadsCollection = db.collection("Leads");

    // Find documents (does NOT create collection if empty)
    const leads = await leadsCollection.find({}).toArray();

    res.json({ success: true, leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

