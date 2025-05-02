import axios from "axios";

const API_BASE_URL = "http://172.23.162.247:3000/api"; // Replace with your actual API base URL

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
});

// Example: Fetch data from an endpoint
export const fetchData = async (endpoint) => {
    try {
        const response = await apiClient.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export default apiClient;
