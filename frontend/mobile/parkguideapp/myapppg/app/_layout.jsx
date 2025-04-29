import React from "react";
import { View, Text } from "react-native";
import { Tabs } from "expo-router";

const _layout = () => {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            style={{ zIndex: 999 }}>
            
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            
            <Tabs.Screen name="certificate" options={{ title: "Certificate" }} />

            <Tabs.Screen name="module" options={{ title: "Module" }} />
        </Tabs>
    );
};

export default _layout;
