import React from "react";
import { Tabs } from "expo-router";
import MainTabBar from "../../components/ADMINdashboard/MainTabBar";

const _layout = () => {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <MainTabBar {...props} />}
            style={{ zIndex: 999 }}
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
