/**
 * Safely format a price value to 2 decimal places
 *
 * @param {*} price - The price value to format
 * @param {string} [prefix='RM'] - Currency symbol to prepend to price
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, prefix = "RM") => {
    // Handle null, undefined, non-numeric values
    if (price === null || price === undefined || isNaN(price)) {
        return "FREE";
    }

    // Convert to number if it's a string
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    // Return FREE for zero prices
    if (numericPrice === 0) {
        return "FREE";
    }

    // Check if it's a valid number after conversion
    if (isNaN(numericPrice)) {
        return `${prefix}0.00`;
    }

    // Format with 2 decimal places
    try {
        return `${prefix}${numericPrice.toFixed(2)}`;
    } catch (error) {
        console.error("Error formatting price:", error);
        return `${prefix}0.00`;
    }
};
