// controllers/dynamicdbCreation/registerCompanyController.js
import Tenant from "../../models/dynamicdbCreation/dynamicdbCreationModel.js";
import { createTenantCollection } from "../../utils/dynamicdbCreationTenant.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName, email, phoneNumber } = req.body;

    // Validation
    if (!companyName || !email || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check existing tenant
    const existingTenant = await Tenant.findOne({ email: email.toLowerCase() });
    if (existingTenant) {
      return res.status(400).json({ 
        success: false, 
        message: "Tenant already exists" 
      });
    }

    // Generate DB name
    const dbName = `crm_${companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    
    // Create tenant
    const tenant = await Tenant.create({
      companyName: companyName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      dbName,
      mongoURI: process.env.MONGO_URI.replace('/maincrm', `/${dbName}`)
    });

    // Create tenant collection
    await createTenantCollection(dbName);

    res.status(201).json({
      success: true,
      message: `Tenant registered: ${companyName}`,
      data: {
        tenantId: tenant._id,
        companyName: tenant.companyName,
        dbName: tenant.dbName
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed",
      error: error.message
    });
  }
};
