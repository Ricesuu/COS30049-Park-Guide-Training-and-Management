import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/Firebase";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../src/api/api"; // API client with correct baseURL

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [role, setRole] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Helper: Retry fetching user info from backend (max 3 attempts)
    const fetchUserDataWithRetry = async (
        token,
        attempts = 3,
        delay = 1000
    ) => {
        for (let i = 0; i < attempts; i++) {
            try {
                const response = await apiClient.get("/users/login", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = response.data;
                console.log("🌐 Backend role response:", data);

                setRole(data.role);
                setStatus(data.status);
                await AsyncStorage.setItem("userRole", data.role);
                await AsyncStorage.setItem("userStatus", data.status);
                return;
            } catch (err) {
                if (err.response?.status === 404 && i < attempts - 1) {
                    console.warn(
                        `⚠️ User not found in backend DB yet. Retrying in ${delay}ms...`
                    );
                    await new Promise((res) => setTimeout(res, delay));
                } else {
                    throw err;
                }
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("📡 Firebase auth state changed.");
            setLoading(true);

            if (user) {
                console.log("✅ User detected:", user.uid);

                try {
                    // Load cached role/status if available
                    const [cachedRole, cachedStatus] = await Promise.all([
                        AsyncStorage.getItem("userRole"),
                        AsyncStorage.getItem("userStatus"),
                    ]);

                    console.log("🧠 Cached role:", cachedRole);
                    console.log("🧠 Cached status:", cachedStatus);

                    setAuthUser(user);
                    setRole(cachedRole);
                    setStatus(cachedStatus);

                    // 🔐 Get fresh token
                    const token = await user.getIdToken();
                    console.log("🔐 Fetched token:", token);

                    // Store the token in AsyncStorage for later API requests
                    await AsyncStorage.setItem("authToken", token);

                    // ✅ Fetch latest role/status with retry support
                    await fetchUserDataWithRetry(token);
                } catch (err) {
                    console.error("❌ AuthContext error:", err);
                    setAuthUser(null);
                    setRole(null);
                    setStatus(null);
                    await AsyncStorage.multiRemove([
                        "userRole",
                        "userStatus",
                        "authToken",
                    ]);
                    router.replace("/");
                }
            } else {
                console.log("🚪 User signed out or session expired.");
                setAuthUser(null);
                setRole(null);
                setStatus(null);
                await AsyncStorage.multiRemove([
                    "userRole",
                    "userStatus",
                    "authToken",
                ]);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authUser,
                role,
                status,
                loading,
                setAuthUser,
                setRole,
                setStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
