// Constants for the backend API
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://192.168.85.1:3000";
export const IMAGE_BASE_PATH = `${API_BASE_URL}/module-images/`;
export const VIDEO_BASE_PATH = `${API_BASE_URL}/module-videos/`;
