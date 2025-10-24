import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { getDBConnection } from "./path/to/your/dbConnectionFile.js"; // adjust path

jest.setTimeout(30000); // Increase timeout for DB connection

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  process.env.DYNAMIC_MONGO_URI = mongoServer.getUri().replace(/\/$/, ""); // remove trailing slash
});

afterAll(async () => {
  // Stop server and close connections
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("getDBConnection", () => {
  it("should throw error if dbName is not provided", async () => {
    await expect(getDBConnection()).rejects.toThrow("Database name is required");
  });

  it("should create a new connection if dbName is provided", async () => {
    const dbName = "testDB1";
    const conn = await getDBConnection(dbName);

    expect(conn).toBeDefined();
    expect(conn.name).toBe(dbName);
    expect(conn.readyState).toBe(1); // 1 = connected
  });

  it("should reuse an existing connection if called again with same dbName", async () => {
    const dbName = "testDB2";
    const firstConn = await getDBConnection(dbName);
    const secondConn = await getDBConnection(dbName);

    expect(firstConn).toBe(secondConn); // same connection instance
  });
});
