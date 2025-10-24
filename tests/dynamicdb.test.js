import { jest } from "@jest/globals";

// ✅ 1. Define mocks before importing controller
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockGetTenantDB = jest.fn();

// ✅ 2. Mock the model and utils
jest.unstable_mockModule("../src/models/dynamicdbCreation/dynamicdbCreationModel.js", () => ({
  default: {
    findOne: mockFindOne,
    create: mockCreate,
  },
}));

jest.unstable_mockModule("../src/utils/dynamicdbCreationTenant.js", () => ({
  getTenantDB: mockGetTenantDB,
}));

// ✅ 3. Now import the controller AFTER mocks are set up
const { registerCompany } = await import(
  "../src/controllers/dynamicdbCreation/dynamicdbCreationControllers.js"
);

describe("🧪 registerCompany Controller (Unit Tests)", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        companyName: "Test Company",
        email: "test@example.com",
        phoneNumber: "9999999999",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("should return 400 if any required field is missing", async () => {
    req.body = {};

    await registerCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "All fields are required",
    });
  });

  test("should return 400 if tenant with email already exists", async () => {
    mockFindOne.mockResolvedValueOnce({ email: "test@example.com" });

    await registerCompany(req, res);

    expect(mockFindOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Tenant with this email already exists",
    });
  });

  test("should create a new tenant and return 201 on success", async () => {
    mockFindOne.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValueOnce({
      _id: "tenant123",
      companyName: "Test Company",
      email: "test@example.com",
      phoneNumber: "9999999999",
      dbName: "crm_test_company_123456",
      mongoURI: "mongodb+srv://.../crm_test_company_123456",
    });
    mockGetTenantDB.mockResolvedValueOnce(true);

    await registerCompany(req, res);

    expect(mockFindOne).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();
    expect(mockGetTenantDB).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should handle unexpected server errors gracefully", async () => {
    mockFindOne.mockRejectedValueOnce(new Error("DB crashed"));

    await registerCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "DB crashed",
    });
  });
});
