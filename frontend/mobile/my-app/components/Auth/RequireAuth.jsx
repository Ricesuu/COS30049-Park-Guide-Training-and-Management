// components/RequireAuth.jsx
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RequireAuth({ children, allowedRoles = [] }) {
    const { authUser, role, status, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const checkAuthState = async () => {
            if (!loading) {
                const storedToken = await AsyncStorage.getItem("authToken");
                const storedRole = await AsyncStorage.getItem("userRole");
                const storedStatus = await AsyncStorage.getItem("userStatus");

                if (!authUser && !storedToken) {
                    // No authentication data found
                    await AsyncStorage.multiRemove(["userRole", "userStatus", "authToken"]);
                    router.replace("/");
                } else if (storedStatus !== "approved" || !allowedRoles.includes(storedRole)) {
                    // Invalid role or status
                    router.replace("/unauthorized");
                }
            }
        };

        checkAuthState();
    }, [authUser, role, status, loading]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Check both current state and stored state
    const hasValidAuth = (authUser || AsyncStorage.getItem("authToken")) && 
                        status === "approved" && 
                        allowedRoles.includes(role);

    if (!hasValidAuth) {
        return null;
    }

    return children;
}
