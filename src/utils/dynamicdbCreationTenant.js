// utils/dynamicdbCreationTenant.js
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const tenantConnections = new Map();

export const getTenantDB = async (dbName) => {
  try {
    // Reuse existing connection if available
    if (tenantConnections.has(dbName)) {
      const connection = tenantConnections.get(dbName);
      if (connection.readyState === 1) {
        return connection;
      }
      tenantConnections.delete(dbName);
    }

    // Build tenant URI
    const baseURI = process.env.MONGO_URI;
    const tenantURI = baseURI.replace('/maincrm', `/${dbName}`);
    
    // Create connection
    const connection = mongoose.createConnection(tenantURI);
    
    // Wait for connection
    await new Promise((resolve, reject) => {
      connection.once('connected', resolve);
      connection.once('error', reject);
      setTimeout(() => reject(new Error('Connection timeout')), 15000);
    });

    tenantConnections.set(dbName, connection);
    console.log(`✅ Connected to: ${dbName}`);
    
    return connection;

  } catch (error) {
    console.error(`❌ Connection failed for ${dbName}:`, error.message);
    throw error;
  }
};

export const createTenantCollection = async (dbName) => {
  try {
    const connection = await getTenantDB(dbName);
    
    // Create only one collection - 'leads'
    await connection.db.createCollection('leads');
    
    console.log(`✅ Created 'leads' collection for: ${dbName}`);
    
    return { collection: 'leads' };

  } catch (error) {
    console.error(`❌ Failed to create collection for ${dbName}:`, error.message);
    throw error;
  }
};
