// Centralized API Configuration
// Update the NGROK_URL to change the backend endpoint for all visitor pages

// Current ngrok URL - Update this when your ngrok URL changes
const NGROK_URL = "https://b83a-175-136-7-9.ngrok-free.app";

// API base URL - Uses ngrok for development, can be easily switched to production
export const API_URL = NGROK_URL;

// Alternative configurations for different environments
export const ENVIRONMENTS = {
  DEVELOPMENT: "http://localhost:3000",
  NGROK: NGROK_URL,
  PRODUCTION: "https://your-production-api.com",
};

// Helper function to switch environments easily
export const getApiUrl = (environment = "NGROK") => {
  return ENVIRONMENTS[environment] || NGROK_URL;
};
