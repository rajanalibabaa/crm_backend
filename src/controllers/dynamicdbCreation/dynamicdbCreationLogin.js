// controllers/dynamicdbCreation/loginCompanyController.js
import Tenant from "../../models/dynamicdbCreation/dynamicdbCreationModel.js";
import { getTenantDB } from "../../utils/dynamicdbCreationTenant.js";

export const loginCompanyUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email required" 
      });
    }

    // Find tenant
    const tenant = await Tenant.findOne({ 
      email: email.toLowerCase(),
      status: 'active'
    });

    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: "Tenant not found" 
      });
    }

    // Get tenant data
    const connection = await getTenantDB(tenant.dbName);
    const leads = await connection.db.collection("leads").find({}).limit(50).toArray();

    res.json({ 
      success: true,
      message: "Login successful",
      data: {
        tenant: {
          id: tenant._id,
          companyName: tenant.companyName,
          dbName: tenant.dbName
        },
        leads: leads,
        totalLeads: leads.length
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Login failed"
    });
  }
};
