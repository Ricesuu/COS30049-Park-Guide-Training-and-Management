
/**
 * Safely format a price value to 2 decimal places
 * 
 * @param {*} price - The price value to format
 * @param {string} [prefix='$'] - Currency symbol to prepend to price
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, prefix = '$') => {
  // Handle null, undefined, non-numeric values
  if (price === null || price === undefined || isNaN(price)) {
    return `${prefix}0.00`;
  }
  
  // Convert to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if it's a valid number after conversion
  if (isNaN(numericPrice)) {
    return `${prefix}0.00`;
  }
  
  // Format with 2 decimal places
  try {
    return `${prefix}${numericPrice.toFixed(2)}`;
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${prefix}0.00`;
  }
};
