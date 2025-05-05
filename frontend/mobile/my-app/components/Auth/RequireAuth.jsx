// components/RequireAuth.jsx
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function RequireAuth({ children, allowedRoles = [] }) {
    const { authUser, role, status, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!authUser) {
                router.replace("/"); // Redirect to login
            } else if (status !== "approved" || !allowedRoles.includes(role)) {
                router.replace("/unauthorized"); // Block access
            }
        }
    }, [authUser, role, status, loading]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return children;
}
