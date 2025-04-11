import React, { useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";

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
            <View className="mb-5 p-1">
                <Text className="text-lg font-bold mb-2">
                    IoT Monitoring Parameters
                </Text>
                <View className="flex-row justify-between">
                    {[
                        {
                            icon: (
                                <MaterialIcons
                                    name="thermostat"
                                    size={24}
                                    color="black"
                                />
                            ),
                            label: "Temperature:",
                            value: "25°C",
                        },
                        {
                            icon: (
                                <Entypo name="drop" size={24} color="black" />
                            ),
                            label: "Humidity:",
                            value: "60%",
                        },
                        {
                            icon: (
                                <AntDesign
                                    name="bulb1"
                                    size={24}
                                    color="black"
                                />
                            ),
                            label: "Light:",
                            value: "Normal",
                        },
                    ].map((item, index) => {
                        const scaleAnim = useRef(new Animated.Value(1)).current;

                        const handlePressIn = () => {
                            Animated.spring(scaleAnim, {
                                toValue: 0.95,
                                useNativeDriver: true,
                            }).start();
                        };

                        const handlePressOut = () => {
                            Animated.spring(scaleAnim, {
                                toValue: 1,
                                useNativeDriver: true,
                            }).start();
                        };

                        return (
                            <Animated.View
                                key={index}
                                style={{
                                    transform: [{ scale: scaleAnim }],
                                }}
                                className="bg-gray-300 rounded-lg p-3 flex-1 mx-1 items-center"
                            >
                                <Pressable
                                    onPressIn={handlePressIn}
                                    onPressOut={handlePressOut}
                                >
                                    <View className="items-center">
                                        {item.icon}
                                    </View>
                                    <Text className="text-center">
                                        {item.label}
                                    </Text>
                                    <Text className="text-center">
                                        {item.value}
                                    </Text>
                                </Pressable>
                            </Animated.View>
                        );
                    })}
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
