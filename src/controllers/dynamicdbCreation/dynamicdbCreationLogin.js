import Tenant from "../../models/dynamicdbCreation/dynamicdbCreationModel.js";
import { getTenantDB } from "../../utils/dynamicdbCreationTenant.js";
import mongoose from "mongoose";

export const loginCompanyUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Find which DB this user belongs to
    const tenant = await Tenant.findOne({ email });
    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    // Connect to their own DB
    const db = await getTenantDB(tenant.dbName);

    // Example: Access tenant's collection
    const Lead = db.model("Leads", new mongoose.Schema({ name: String, email: String }));
    const leads = await Lead.find();

    res.json({ success: true, leads });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
