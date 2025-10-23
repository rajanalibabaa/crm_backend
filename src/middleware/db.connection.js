import mongoose from "mongoose";

const connections = new Map();

export const getDBConnection = async (dbName) => {
  if (!dbName) throw new Error("Database name is required");

  if (connections.has(dbName)) {
    // Reuse existing connection
    return connections.get(dbName);
  }

  const uri = `${process.env.DYNAMIC_MONGO_URI}/${dbName}?retryWrites=true&w=majority`;
  console.log(`🔗 Connecting to database: ${dbName}`);

  const conn = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  conn.on("connected", () => console.log(`✅ Connected to database: ${dbName}`));
  conn.on("error", (err) => {
    console.error(`⚠️ MongoDB connection error for ${dbName}:`, err);
    connections.delete(dbName);
  });

  connections.set(dbName, conn);
  return conn;
};
