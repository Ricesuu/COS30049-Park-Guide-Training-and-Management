import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { API_URL } from "../src/constants/constants";

// Construct API endpoint
const API_ENDPOINT = `${API_URL}/api`;

/**
 * Fetch modules purchased by the current user
 */
export const fetchUserModules = async () => {
    try {
        // Get user token from storage
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required");
        }

        // Add cache-busting parameter to prevent caching
        const timestamp = new Date().getTime();
        const response = await axios.get(
            `${API_ENDPOINT}/training-modules/user?t=${timestamp}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                },
            }
        );
        // Format the data to ensure consistency
        const formattedModules = response.data.map((module) => ({
            ...module,
            id: module.id || module.module_id,
            name: module.name || module.module_name,
            title: module.title || module.name || module.module_name,
            progress: module.progress !== undefined ? module.progress : 0,
            difficulty: module.difficulty || "beginner",
            aspect: module.aspect || "general",
            videoUrl: module.video_url || module.videoUrl,
            courseContent: module.course_content || module.courseContent,
            imageUrl:
                module.imageUrl ||
                module.image_url ||
                "https://via.placeholder.com/150",
        }));

        console.log("Fetched user modules:", formattedModules);
        return formattedModules;
    } catch (error) {
        console.error("Error fetching user modules:", error);
        throw error;
    }
};

/**
 * Fetch all available modules for purchase
 */
export const fetchAvailableModules = async () => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required");
        }

        try {
            // First, get user's existing modules to filter them out
            const userModulesResponse = await axios.get(
                `${API_ENDPOINT}/training-modules/user`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Cache-Control": "no-cache",
                        Pragma: "no-cache",
                    },
                }
            );

            const userModuleIds = new Set(
                userModulesResponse.data.map(
                    (module) => module.id || module.module_id
                )
            );

            console.log(`User has ${userModuleIds.size} existing modules`);

            // Then get available modules
            const response = await axios.get(
                `${API_ENDPOINT}/training-modules/available`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Filter out modules the user already has and ensure all have price property            // Get all modules for checking compulsory ones
            const allPurchasedModules = userModulesResponse.data;
            const missingCompulsoryModules = response.data
                .filter((module) => module.is_compulsory)
                .filter((module) => !userModuleIds.has(module.id));

            const hasAllCompulsoryModules =
                missingCompulsoryModules.length === 0;

            const modules = response.data
                .filter((module) => !userModuleIds.has(module.id))
                .map((module) => ({
                    ...module,
                    price:
                        module.price !== undefined
                            ? parseFloat(module.price)
                            : 0,
                    is_compulsory: Boolean(module.is_compulsory),
                    canPurchase:
                        module.is_compulsory || hasAllCompulsoryModules,
                    // Add a field to track incomplete compulsory modules
                    incompleteCompulsoryModules:
                        !module.is_compulsory && !hasAllCompulsoryModules
                            ? missingCompulsoryModules.map((m) => m.name)
                            : [],
                    // Add a field to indicate if module is locked due to compulsory requirements
                    isLocked: !module.is_compulsory && !hasAllCompulsoryModules,
                }));

            console.log(
                `Filtered out ${
                    response.data.length - modules.length
                } modules the user already has`
            );
            return modules;
        } catch (apiError) {
            console.warn("API error, falling back to mock data:", apiError);
            // Return mock data if API fails
            return [
                {
                    id: "1",
                    name: "Park Flora Identification",
                    description:
                        "Learn to identify common and rare plant species found in national parks.",
                    price: 29.99,
                    imageUrl:
                        "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2",
                    purchase_status: "available",
                },
                {
                    id: "2",
                    name: "Wildlife Conservation",
                    description:
                        "Comprehensive guide to wildlife conservation techniques and best practices.",
                    price: 39.99,
                    imageUrl:
                        "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
                    purchase_status: "available",
                },
                {
                    id: "3",
                    name: "Advanced Visitor Management",
                    description:
                        "Strategies for managing large visitor groups and enhancing their experience.",
                    price: 49.99,
                    imageUrl:
                        "https://images.unsplash.com/photo-1527525443983-6e60c75fff46",
                    purchase_status: "available",
                },
            ];
        }
    } catch (error) {
        console.error("Error fetching available modules:", error);
        throw error;
    }
};

/**
 * Direct enrollment for free modules - bypasses payment process
 */
export const directEnrollModule = async (moduleId, moduleName) => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required");
        }

        // Create a request to directly create a ModulePurchases record for free modules
        const response = await axios.post(
            `${API_ENDPOINT}/training-modules/${moduleId}/enroll`,
            { moduleName },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error enrolling in free module:", error);
        throw error;
    }
};

/**
 * Purchase a module
 */
export const purchaseModule = async (moduleId, paymentDetails) => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required");
        }

        // Create form data for the payment submission with receipt image
        const formData = new FormData();
        formData.append("moduleId", moduleId);
        formData.append(
            "paymentPurpose",
            `Module Purchase: ${paymentDetails.moduleName}`
        );
        formData.append("paymentMethod", paymentDetails.paymentMethod);
        formData.append("amountPaid", paymentDetails.amount);

        // If receipt image is not provided, we'll create a mock receipt for demo purposes
        // In a real app, this should be handled by proper receipt collection
        if (!paymentDetails.receiptImage) {
            // Use a placeholder receipt image (this is for demo only)
            const placeholderImage =
                "https://example.com/placeholder-receipt.jpg";

            try {
                // Attempt to fetch a placeholder image
                const response = await fetch(placeholderImage);
                if (response.ok) {
                    const blob = await response.blob();
                    formData.append("receipt", {
                        uri: placeholderImage,
                        name: "receipt.jpg",
                        type: "image/jpeg",
                    });
                } else {
                    throw new Error("Unable to get placeholder image");
                }
            } catch (error) {
                console.warn("Using default receipt data");
                // If fetching fails, use a predefined base64 image (very small transparent pixel)
                formData.append("receipt", {
                    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                    name: "receipt.jpg",
                    type: "image/png",
                });
            }
        } else {
            // Add the provided receipt image
            const imageUri = paymentDetails.receiptImage.uri;
            const filename = imageUri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : "image/jpeg";

            formData.append("receipt", {
                uri: imageUri,
                name: filename,
                type,
            });
        }

        const response = await axios.post(
            `${API_ENDPOINT}/payment-transactions`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error purchasing module:", error);
        throw error;
    }
};

/**
 * Submit a comment for a module
 */
export const submitComment = async (moduleId, comment) => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required");
        }
        const response = await axios.post(
            `${API_ENDPOINT}/training-modules/${moduleId}/comment`,
            { comment },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error submitting comment:", error);
        throw error;
    }
};

/**
 * Check if a module is accessible to the current user
 */
export const checkModuleAccess = async (moduleId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await axios.get(
            `${API_ENDPOINT}/training-modules/${moduleId}/access`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.hasAccess;
    } catch (error) {
        console.error("Error checking module access:", error);
        return false; // Default to no access on error
    }
};

/**
 * Get purchase status for a module
 */
export const getModulePurchaseStatus = async (moduleId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await axios.get(
            `${API_ENDPOINT}/training-modules/${moduleId}/purchase-status`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error getting module purchase status:", error);
        return { status: "not_purchased" }; // Default status
    }
};

/**
 * Fetch quiz questions for a module
 */
export const fetchModuleQuiz = async (moduleId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await axios.get(
            `${API_ENDPOINT}/training-modules/${moduleId}/quiz`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching module quiz:", error);
        throw error;
    }
};

/**
 * Submit quiz answers for a module
 */
export const submitQuizAnswers = async (moduleId, answers, attemptId) => {
    try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
            throw new Error("Authentication required");
        }

        const response = await axios.post(
            `${API_ENDPOINT}/training-modules/${moduleId}/quiz`,
            { answers, attemptId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error submitting quiz answers:", error);
        throw error;
    }
};
