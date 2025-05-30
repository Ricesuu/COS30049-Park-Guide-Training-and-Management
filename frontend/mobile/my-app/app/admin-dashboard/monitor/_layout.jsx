import React from "react";
import { Stack } from "expo-router";
import { LogBox } from "react-native";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const MonitorLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* The default screen for the monitor tab */}
            <Stack.Screen name="index" />
            {/* Historical Trends page */}
            <Stack.Screen name="trends" />
        </Stack>
    );
};

export default MonitorLayout;
