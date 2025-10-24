// models/dynamicdbCreation/dynamicdbCreationModel.js
import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  companyName: { 
    type: String, 
    required: [true, "Company name is required"],
    trim: true,
    maxLength: [100, "Company name cannot exceed 100 characters"]
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  phoneNumber: { 
    type: String, 
    required: [true, "Phone number is required"],
    trim: true
  },
  dbName: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  mongoURI: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  registeredBy: { type: String },
  lastAccessedAt: { type: Date, default: null },
  subscriptionPlan: {
    type: String,
    enum: ["basic", "premium", "enterprise"],
    default: "basic"
  }
}, {
  timestamps: true // This automatically handles createdAt and updatedAt
});

// Indexes for better performance
tenantSchema.index({ email: 1 });
tenantSchema.index({ dbName: 1 });
tenantSchema.index({ status: 1 });

export default mongoose.model("Tenant", tenantSchema);
