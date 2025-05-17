// components/PGdashboard/Common/LogoutButton.jsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";

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
                        await signOut();
                        router.replace("/");
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
