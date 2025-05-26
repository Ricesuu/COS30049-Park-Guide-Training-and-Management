import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Import the API URL from the centralized config
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the API config file to get the current ngrok URL
const apiConfigPath = join(__dirname, "src", "config", "apiConfig.js");
const apiConfigContent = readFileSync(apiConfigPath, "utf-8");
const ngrokUrlMatch = apiConfigContent.match(/const NGROK_URL = "([^"]+)"/);
const NGROK_URL = ngrokUrlMatch ? ngrokUrlMatch[1] : "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: NGROK_URL,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
