import axios from "axios";
import { API_URL } from "../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Enhanced debugging: Log the API URL on initialization
console.log(`🔌 API configured with base URL: ${API_URL}/api`);

const API_BASE_URL = `${API_URL}/api`; // Construct API base URL from constants

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
});

// Enhanced fetchData function to handle different HTTP methods
export const fetchData = async (endpoint, options = {}) => {
    try {
        console.log(`📡 API Request: ${options.method || "GET"} ${endpoint}`);

        // Get the auth token from AsyncStorage
        const authToken = await AsyncStorage.getItem("authToken");

        // Set up headers with authentication token
        const headers = {
            ...options.headers,
            "Content-Type": "application/json",
        };

        // Add authentication token if available
        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }

        const method = (options.method || "GET").toLowerCase();
        let response;

        switch (method) {
            case "post":
                response = await apiClient.post(
                    endpoint,
                    JSON.parse(options.body || "{}"),
                    { headers }
                );
                break;
            case "put":
                response = await apiClient.put(
                    endpoint,
                    JSON.parse(options.body || "{}"),
                    { headers }
                );
                break;
            case "delete":
                response = await apiClient.delete(endpoint, {
                    data: JSON.parse(options.body || "{}"),
                    headers,
                });
                break;
            default: // GET
                response = await apiClient.get(endpoint, { headers });
                break;
        }

        console.log(
            `✅ API Response: ${response.status} ${response.statusText}`
        );
        return response.data;
    } catch (error) {
        console.error("❌ API Error:", error);
        console.error("🔍 Error details:", {
            message: error.message,
            url: `${API_BASE_URL}${endpoint}`,
            method: options.method || "GET",
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            // More detailed network error debugging
            code: error.code,
            isAxiosError: error.isAxiosError,
            config: error.config
                ? {
                      url: error.config.url,
                      method: error.config.method,
                      baseURL: error.config.baseURL,
                  }
                : "No config available",
        });
        throw error;
    }
};

export default apiClient;
