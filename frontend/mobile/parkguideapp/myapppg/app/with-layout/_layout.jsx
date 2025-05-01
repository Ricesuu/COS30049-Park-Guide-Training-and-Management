import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            style={{ zIndex: 999 }}
        >
            {/* Module Tab */}
            <Tabs.Screen name="module" options={{ title: "Module" }} />

            {/* Certificate Tab */}
            <Tabs.Screen name="certificate" options={{ title: "Certificate" }} />

            {/* Home Tab */}
            <Tabs.Screen name="index" options={{ title: "Home" }} />

            {/* Plant Info Tab */}
            <Tabs.Screen name="plantinfo" options={{ title: "Plant Info" }} />

            {/* Identification Tab */}
            <Tabs.Screen name="identification" options={{ title: "Identification" }} />  
        </Tabs>
    );
};

export default _layout;
