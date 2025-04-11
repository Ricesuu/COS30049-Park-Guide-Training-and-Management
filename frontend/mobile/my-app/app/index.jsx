import React, { useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";

import ".././global.css";

/**
 * HomePage component renders the Admin Dashboard interface.
 *
 * This component includes:
 * - A header section with a welcome message for the admin.
 * - A dashboard section containing:
 *   - Pending approvals information.
 *   - IoT monitoring parameters with animated icons for temperature, humidity, and light.
 *   - Transaction approvals information.
 *
 * The IoT monitoring parameters are interactive, with animations triggered on press events.
 *
 * @component
 * @returns {JSX.Element} The rendered Admin Dashboard interface.
 */

// HomePage component renders the Admin Dashboard interface
// This component includes a header section with a welcome message for the admin and a dashboard section
// containing pending approvals information, IoT monitoring parameters, and transaction approvals information.
// The IoT monitoring parameters are interactive, with animations triggered on press events.
const HomePage = () => {
    return (
        <View className="bg-green-600 flex-1">
            {/* Admin Dashboard Header */}
            <View className="p-5 pt-12 pb-10 rounded-b-3xl">
                <Text className="text-3xl font-black text-white text-center tracking-wider drop-shadow-md">
                    Admin Dashboard
                </Text>
                <Text className="text-base text-green-100 text-center italic mt-1">
                    Welcome back, Admin!
                </Text>
            </View>

            {/* Dashboard Section */}
            <View
                className="bg-white pt-10 p-7 flex-1"
                style={{
                    elevation: 10,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                }}
            >
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

                    {/* Animated IoT Monitoring Parameters */}
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
                                    <Entypo
                                        name="drop"
                                        size={24}
                                        color="black"
                                    />
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
                            const scaleAnim = useRef(
                                new Animated.Value(1)
                            ).current;

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
        </View>
    );
};

export default HomePage;
