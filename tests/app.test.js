import request from "supertest";
import app from "../app.js";

describe("🧪 API Server Test", () => {
  test("should return success message on /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("✅ Server is running fine port");
  });

  test("should handle 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown");
    expect(res.statusCode).toBe(404);
  });
});

