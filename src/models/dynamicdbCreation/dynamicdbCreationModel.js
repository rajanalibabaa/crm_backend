import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  dbName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Tenant", tenantSchema);
