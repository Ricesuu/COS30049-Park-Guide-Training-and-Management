import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";

const ProfilePage = () => {
    const adminName = "Admin Name"; // Replace with dynamic data if available

    const handleChangeDetails = () => {
        Alert.alert("Change Details", "Navigate to the Change Details page.");
        // Implement navigation or functionality to change details
    };

    const handleChangePassword = () => {
        Alert.alert("Change Password", "Navigate to the Change Password page.");
        // Implement navigation or functionality to change password
    };

    const handleLogout = () => {
        Alert.alert("Logout", "You have been logged out.");
        // Implement logout functionality
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            {/* Header */}
            <Text
                style={{
                    fontSize: 24,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 20,
                    backgroundColor: "rgb(22, 163, 74)",
                }}
            >
                Profile
            </Text>

            {/* Profile Details */}
            <View
                style={{
                    backgroundColor: "white",
                    margin: 20,
                    padding: 20,
                    borderRadius: 10,
                    elevation: 5,
                    shadowColor: "#000",
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#333",
                        marginBottom: 10,
                    }}
                >
                    Admin Name
                </Text>
                <Text
                    style={{
                        fontSize: 16,
                        color: "#555",
                        marginBottom: 20,
                    }}
                >
                    {adminName}
                </Text>

                {/* Change Details Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: "rgb(22, 163, 74)",
                        padding: 15,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}
                    onPress={handleChangeDetails}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        Change Details
                    </Text>
                </TouchableOpacity>

                {/* Change Password Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: "rgb(22, 163, 74)",
                        padding: 15,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}
                    onPress={handleChangePassword}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        Change Password
                    </Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: "rgb(220, 38, 38)",
                        padding: 15,
                        borderRadius: 10,
                    }}
                    onPress={handleLogout}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfilePage;
