import mongoose from "mongoose";

const tenantConnections = {};

export const getTenantDB = async (dbName) => {
  if (tenantConnections[dbName]) {
    return tenantConnections[dbName];
  }

  const clusterBase = "mongodb+srv://rajanalibabaa:LJkzt84ulD3yb74A@mrfranchise.vanempq.mongodb.net";
  const uri = `${clusterBase}/${dbName}?retryWrites=true&w=majority&tls=true&appName=mrfranchise`;

  const connection = await mongoose.createConnection(uri);
  tenantConnections[dbName] = connection;

  console.log(`✅ Connected to tenant DB: ${dbName}`);
  return connection;
};
