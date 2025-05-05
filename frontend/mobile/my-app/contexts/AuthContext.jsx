import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/Firebase";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../src/api/api"; // Import the API client

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [role, setRole] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("📡 Firebase auth state changed.");

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

                    // 🔐 Refresh token and fetch latest role/status
                    const token = await user.getIdToken();
                    console.log("🔐 Fetched token:", token);

                    // Using apiClient instead of hardcoded fetch
                    const response = await apiClient.get("/users/login", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const data = response.data;
                    console.log("🌐 Backend role response:", data);

                    setRole(data.role);
                    setStatus(data.status);
                    await AsyncStorage.setItem("userRole", data.role);
                    await AsyncStorage.setItem("userStatus", data.status);
                } catch (err) {
                    console.error("❌ AuthContext error:", err);
                    setAuthUser(null);
                    setRole(null);
                    setStatus(null);
                    await AsyncStorage.multiRemove(["userRole", "userStatus"]);
                    router.replace("/");
                }
            } else {
                console.log("🚪 User signed out or session expired.");
                setAuthUser(null);
                setRole(null);
                setStatus(null);
                await AsyncStorage.multiRemove(["userRole", "userStatus"]);
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
