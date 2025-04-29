import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            style={{ zIndex: 999 }}
        >
            {/* Home Tab */}
            <Tabs.Screen name="index" options={{ title: "Home" }} />

            {/* Certificate Tab */}
            <Tabs.Screen name="certificate" options={{ title: "Certificate" }} />

            {/* Module Tab */}
            <Tabs.Screen name="module" options={{ title: "Module" }} />
        </Tabs>
    );
};

export default _layout;
