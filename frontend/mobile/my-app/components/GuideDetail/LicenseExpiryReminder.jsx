import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { API_URL } from "../../src/constants/constants";
import { auth } from "../../lib/Firebase";

const LicenseExpiryReminder = ({ guideId, expiryDate }) => {
    const daysUntilExpiry = () => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleSendReminder = async () => {
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(
                `${API_URL}/api/park-guides/${guideId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        action: "sendLicenseExpiryReminder",
                    }),
                }
            );

            if (response.ok) {
                Alert.alert(
                    "Success",
                    "License expiry reminder sent successfully"
                );
            } else {
                throw new Error("Failed to send reminder");
            }
        } catch (error) {
            console.error("Error sending reminder:", error);
            Alert.alert("Error", "Failed to send reminder");
        }
    };

    const days = daysUntilExpiry();

    if (days > 30) return null;

    return (
        <View className="mt-4 p-4 bg-orange-100 rounded-lg">
            <Text className="text-orange-800 mb-2">
                ⚠️ License expires in {days} days
            </Text>
            <TouchableOpacity
                onPress={handleSendReminder}
                className="bg-orange-500 py-2 px-4 rounded-md"
            >
                <Text className="text-white text-center font-semibold">
                    Send Reminder Email
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LicenseExpiryReminder;
