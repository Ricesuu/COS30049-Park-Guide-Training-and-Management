// Constants for the backend API
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://172.23.162.247:3000";
export const IMAGE_BASE_PATH = `${API_BASE_URL}/module-images/`;
export const VIDEO_BASE_PATH = `${API_BASE_URL}/module-videos/`;
