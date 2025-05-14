import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/Firebase";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../src/api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [role, setRole] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUserDataWithRetry = async (token, attempts = 3, delay = 1000) => {
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
                await AsyncStorage.setItem("userStatus", data.status);                // Auto-redirect based on role
                if (data.status === "approved") {
                    const routes = {
                        admin: "/admin-dashboard",
                        park_guide: "/pg-dashboard"
                    };
                    if (routes[data.role]) {
                        router.replace(routes[data.role]);
                    }
                }
                return;
            } catch (err) {
                if (err.response?.status === 404 && i < attempts - 1) {
                    console.warn(`⚠️ User not found in backend DB yet. Retrying in ${delay}ms...`);
                    await new Promise((res) => setTimeout(res, delay));
                } else {
                    throw err;
                }
            }
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const [storedToken, storedRole, storedStatus] = await Promise.all([
                    AsyncStorage.getItem("authToken"),
                    AsyncStorage.getItem("userRole"),
                    AsyncStorage.getItem("userStatus"),
                ]);

                if (storedToken && storedRole && storedStatus) {
                    console.log("📦 Found stored credentials");
                    setRole(storedRole);
                    setStatus(storedStatus);
                      // Auto-redirect if credentials exist
                    if (storedStatus === "approved") {
                        const routes = {
                            admin: "/admin-dashboard",
                            park_guide: "/pg-dashboard"
                        };
                        if (routes[storedRole]) {
                            router.replace(routes[storedRole]);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading stored auth:", error);
            }
        };

        initAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("📡 Firebase auth state changed.");
            setLoading(true);

            if (user) {
                console.log("✅ User detected:", user.uid);
                try {
                    const token = await user.getIdToken(true);
                    await AsyncStorage.setItem("authToken", token);
                    setAuthUser(user);
                    await fetchUserDataWithRetry(token);
                } catch (err) {
                    console.error("❌ AuthContext error:", err);
                    await handleSignOut();
                }
            } else {
                await handleSignOut();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        console.log("🚪 Signing out user");
        setAuthUser(null);
        setRole(null);
        setStatus(null);
        await AsyncStorage.multiRemove(["userRole", "userStatus", "authToken"]);
        router.replace("/");
    };

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
