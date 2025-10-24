// utils/tenantValidation.js
export const validateTenantData = (data) => {
  const errors = [];

  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.push("Company name must be at least 2 characters long");
  }

  if (!data.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.phoneNumber || data.phoneNumber.trim().length < 10) {
    errors.push("Please provide a valid phone number");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize company name for database naming
export const sanitizeDbName = (companyName) => {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 30);
};
