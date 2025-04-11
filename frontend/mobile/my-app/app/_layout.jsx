import React from "react";
import { View, Text } from "react-native";
import { Tabs } from "expo-router";
import TabBar from "../components/TabBar";

const _layout = () => {
    return (
        <Tabs
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="approvals" options={{ title: "Approvals" }} />
            <Tabs.Screen name="manage" options={{ title: "Manage" }} />
            <Tabs.Screen name="monitor" options={{ title: "Monitor" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
};

export default _layout;
