import axios from "axios";
import { API_URL } from "../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import eventEmitter, { AUTH_EVENTS } from "../../utils/eventEmitter";

// Enhanced debugging: Log the API URL on initialization
console.log(`🔌 API configured with base URL: ${API_URL}/api`);

const API_BASE_URL = `${API_URL}/api`; // Construct API base URL from constants

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
});

// Add cancel token for request cancellation
apiClient._cancelToken = null;

// Handle authentication errors globally
let isLogoutInProgress = false;

// Function to handle token expiration
const handleTokenExpiration = async () => {
    // Prevent multiple logout attempts
    if (isLogoutInProgress) {
        console.log(
            "🔄 Token expiration handling already in progress, skipping"
        );
        return;
    }

    isLogoutInProgress = true;
    console.log("🔒 Token expired or unauthorized - logging out user");

    try {
        // Clear authentication data
        await AsyncStorage.multiRemove(["userRole", "userStatus", "authToken"]);

        // Reset authorization header to prevent further authenticated requests
        apiClient.defaults.headers.common["Authorization"] = "";

        // Emit event to notify other components about token expiration
        console.log(
            `🔔 Emitting token expired event: ${AUTH_EVENTS.TOKEN_EXPIRED}`
        );
        eventEmitter.emit(AUTH_EVENTS.TOKEN_EXPIRED);

        // Cancel any pending requests (they would fail anyway with the expired token)
        if (apiClient.CancelToken) {
            console.log("🛑 Cancelling any pending requests");
            apiClient._cancelToken &&
                apiClient._cancelToken.cancel("Token expired");
            apiClient._cancelToken = null;
        }
    } catch (error) {
        console.error("❌ Error during automatic logout:", error);
    } finally {
        // Reset the flag with a small delay to prevent potential race conditions
        setTimeout(() => {
            isLogoutInProgress = false;
            console.log("✅ Token expiration handling completed");
        }, 500);
    }
};

// Add response interceptor to detect unauthorized requests (token expired)
apiClient.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
        // Handle 401 Unauthorized errors (expired token)
        if (error.response && error.response.status === 401) {
            console.log("🛑 Received 401 Unauthorized response");
            // Add more detailed logging for debugging
            console.log(`Request URL: ${error.config.url}`);
            console.log(`Request Method: ${error.config.method}`);
            // Call handler with more context
            handleTokenExpiration();
        }
        return Promise.reject(error);
    }
);

// Enhanced fetchData function to handle different HTTP methods
export const fetchData = async (endpoint, options = {}) => {
    try {
        console.log(`📡 API Request: ${options.method || "GET"} ${endpoint}`);

        // If logout is in progress, reject the request
        if (isLogoutInProgress) {
            console.log(
                "⚠️ API request attempted during logout process - rejecting"
            );
            throw new Error("Authentication session ended");
        }

        // Get the auth token from AsyncStorage
        const authToken = await AsyncStorage.getItem("authToken");

        // Check if token exists for authenticated endpoints
        if (
            !authToken &&
            endpoint !== "/users/register" &&
            !endpoint.includes("/check-login-attempts")
        ) {
            console.log(
                "⚠️ No auth token available for authenticated endpoint"
            );
            throw new Error("Authentication required");
        }

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
        // Handle token expiration specifically in fetchData as well
        if (error.response?.status === 401) {
            console.log("🛑 Token expired or unauthorized in fetchData");
            console.log(`Request endpoint: ${endpoint}`);
            console.log(`Request method: ${options.method || "GET"}`);
            // The interceptor will handle the logout process, but let's make sure it happened
            handleTokenExpiration();
        }

        throw error;
    }
};

export default apiClient;
