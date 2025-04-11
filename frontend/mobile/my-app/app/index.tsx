import React, { useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";

import ".././global.css";

const HomePage = () => {
    return (
        <View className="p-7">
            {/* Admin Dashboard Header */}
            <View className="mb-5">
                <Text className="text-2xl font-extrabold text-green-600 text-center">
                    Admin Dashboard
                </Text>
                <Text className="text-base text-gray-600 text-center italic">
                    Welcome back, Admin!
                </Text>
            </View>

            {/* Dashboard Sections */}
            {/* Pending Approvals Section */}
            <View className="mb-5 bg-gray-200 rounded-lg p-3">
                <Text className="text-lg font-bold mb-2">
                    Pending Approvals
                </Text>
                <Text>No pending approvals at the moment.</Text>
            </View>

            {/* IoT Monitoring Section */}
            <View className="mb-5 bg-gray-200 rounded-lg p-3">
                <Text className="text-lg font-bold mb-2">
                    IoT Monitoring Parameters
                </Text>
                <View className="bg-gray-300 rounded-lg p-3 mb-2">
                    <Text>Temperature: 22°C</Text>
                </View>
                <View className="bg-gray-300 rounded-lg p-3 mb-2">
                    <Text>Humidity: 45%</Text>
                </View>
                <View className="bg-gray-300 rounded-lg p-3">
                    <Text>Light: Normal</Text>
                </View>
            </View>

            {/* Transaction Approvals Section */}
            <View className="mb-5 bg-gray-200 rounded-lg p-3">
                <Text className="text-lg font-bold mb-2">
                    Transaction Approvals
                </Text>
                <Text>No transactions awaiting approval.</Text>
            </View>
        </View>
    );
};

export default HomePage;
