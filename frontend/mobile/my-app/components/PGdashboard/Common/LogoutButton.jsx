// components/PGdashboard/Common/LogoutButton.jsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { LogBox } from "react-native";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const LogoutButton = () => {
    const router = useRouter();
    const { signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace("/");
                        } catch (error) {
                            console.error("Logout failed:", error);
                            Alert.alert(
                                "Error",
                                "Failed to logout. Please try again."
                            );
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: "#e74c3c",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    logoutButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default LogoutButton;
