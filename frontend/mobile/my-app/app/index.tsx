import React, { useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';

import ".././global.css";



const HomePage = () => {
    const AnimatedPressable = ({ title, onPress }: {title: string; onPress: () => void }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current; // Create a unique Animated.Value for each button

        const handlePressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.95, // Shrink the button slightly
                useNativeDriver: true,
            }).start();
        };

        const handlePressOut = () => {
            Animated.spring(scaleAnim, {
                toValue: 1, // Return to original size
                useNativeDriver: true,
            }).start();
        };

        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={onPress}
                    className="bg-gray-200 rounded-lg p-2 mb-2"
                >
                    <Text className="text-base text-gray-600 font-bold text-center">{title}</Text>
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <View className="p-7">
            {/* Admin Dashboard Header */}
            <View className="mb-5">
                <Text className="text-2xl font-extrabold text-green-600 text-center">Admin Dashboard</Text>
                <Text className="text-base text-gray-600 text-center italic">Welcome back, Admin!</Text>
            </View>

            {/* Dashboard Sections */}
            {/* Pending Approvals Section */}
            <View className="mb-5 bg-gray-200 rounded-lg p-3">
                <Text className="text-lg font-bold mb-2">Pending Approvals</Text>
                <Text>No pending approvals at the moment.</Text>
            </View>

            {/* IoT Monitoring Section */}
            <View className="mb-5 bg-gray-200 rounded-lg p-3">
                <Text className="text-lg font-bold mb-2">IoT Monitoring Parameters</Text>
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
                <Text className="text-lg font-bold mb-2">Transaction Approvals</Text>
                <Text>No transactions awaiting approval.</Text>
            </View>

            {/* Navigation Bar */}
            <View>
                <AnimatedPressable title="Home" onPress={() => console.log('Home pressed')} />
                <AnimatedPressable title="Settings" onPress={() => console.log('Settings pressed')} />
                <AnimatedPressable title="Reports" onPress={() => console.log('Reports pressed')} />
                <AnimatedPressable title="Logout" onPress={() => console.log('Logout pressed')} />
            </View>
        </View>
    );
};

export default HomePage;