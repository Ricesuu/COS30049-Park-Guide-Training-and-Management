import React from "react";
import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import MainTabBar from "../components/MainTabBar";

// This is the main layout for the app. It uses the Tabs component from expo-router to create a tabbed navigation system.
// Each tab corresponds to a different screen in the app.
// The TabBar component is used to render the tab bar at the bottom of the screen.
const _layout = () => {
    return (
        // Tabs component is used to create a tabbed navigation system
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <MainTabBar {...props} />}
            style={{ zIndex: 999 }}
        >
            {/* Each screen corresponds to a different tab in the tab bar */}{" "}
            <Tabs.Screen name="monitor" options={{ title: "Monitor" }} />
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="approvals" options={{ title: "Approvals" }} />
            <Tabs.Screen name="manage" options={{ title: "Manage" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
};

export default _layout;
