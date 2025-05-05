import axios from "axios";
import { API_URL } from "../constants/constants";

const API_BASE_URL = `${API_URL}/api`; // Construct API base URL from constants

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
});

// Enhanced fetchData function to handle different HTTP methods
export const fetchData = async (endpoint, options = {}) => {
    try {
        console.log(`API Request: ${options.method || "GET"} ${endpoint}`);

        const method = (options.method || "GET").toLowerCase();
        let response;

        switch (method) {
            case "post":
                response = await apiClient.post(
                    endpoint,
                    JSON.parse(options.body || "{}")
                );
                break;
            case "put":
                response = await apiClient.put(
                    endpoint,
                    JSON.parse(options.body || "{}")
                );
                break;
            case "delete":
                response = await apiClient.delete(endpoint, {
                    data: JSON.parse(options.body || "{}"),
                });
                break;
            default: // GET
                response = await apiClient.get(endpoint);
                break;
        }

        console.log(`API Response: ${response.status} ${response.statusText}`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        console.error("Details:", {
            message: error.message,
            url: `${API_BASE_URL}${endpoint}`,
            method: options.method || "GET",
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
        });
        throw error;
    }
};

export default apiClient;
