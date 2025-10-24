export default {
  testEnvironment: "node",
  transform: {},
  verbose: true,
  forceExit: true,
    detectOpenHandles: true,  // Detects async leaks
  testTimeout: 15000 ,
  moduleFileExtensions: ["js", "json", "mjs"],
};
