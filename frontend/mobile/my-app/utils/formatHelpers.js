// Utility functions for formatting data consistently across components

/**
 * Formats a date string into a user-friendly format
 * @param {string} dateString - Date string in ISO format (YYYY-MM-DD)
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, fallback = "Not available") => {
    if (!dateString) return fallback;

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return fallback;

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch (error) {
        console.warn("Error formatting date:", error);
        return fallback;
    }
};

/**
 * Safely retrieves a property from an object, returning a fallback if not found
 * @param {Object} obj - Source object
 * @param {string} path - Property path (e.g., "user.name")
 * @param {*} fallback - Fallback value if property doesn't exist
 * @returns {*} The property value or fallback
 */
export const getNestedProperty = (obj, path, fallback = undefined) => {
    try {
        if (!obj) return fallback;

        const properties = path.split(".");
        let value = obj;

        for (const property of properties) {
            value = value[property];
            if (value === undefined || value === null) return fallback;
        }

        return value;
    } catch (error) {
        return fallback;
    }
};

/**
 * Creates a standardized error message from various error formats
 * @param {Error|Object} error - Error object
 * @returns {string} Formatted error message
 */
export const formatError = (error) => {
    if (!error) return "An unknown error occurred";

    // Handle Axios error
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Unknown error";

        // Handle common status codes
        if (status === 404) {
            return "The requested resource was not found";
        } else if (status === 401) {
            return "You are not authorized to access this resource";
        } else if (status === 403) {
            return "Access forbidden";
        }

        return `Error ${status}: ${message}`;
    }

    // Handle network error
    if (error.request) {
        return "Network error - please check your connection";
    }

    // Handle standard errors
    return error.message || "An unknown error occurred";
};
