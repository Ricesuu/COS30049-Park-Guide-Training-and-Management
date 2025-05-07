import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

const GuideButtons = ({ onPress }) => {
    return (
        // Button to add a new guide
        <View className="p-4">
            <TouchableOpacity
                className="bg-green-600 p-4 rounded-lg"
                onPress={onPress}
            >
                <Text className="text-white text-center font-bold">
                    Add New Guide
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default GuideButtons;
