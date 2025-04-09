import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import "./global.css";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-gray-200">
            <Text className="font-bold text-5xl text-blue-500">
                Hello world!
            </Text>
            <StatusBar style="auto" />
        </View>
    );
}
