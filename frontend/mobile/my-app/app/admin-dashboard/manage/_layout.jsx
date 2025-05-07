import React from "react";
import { Stack } from "expo-router";

const ManageLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="manage"
                options={{ title: "Manage Park Guides" }}
            />
            <Stack.Screen
                name="guide-detail"
                options={{ title: "Guide Details" }}
            />
        </Stack>
    );
};

export default ManageLayout;
