import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet, Text } from "react-native";

/**
 * Layout component for the Marketplace section
 * This provides a layout wrapper for the marketplace page with a rectangular header
 */
const MarketplaceLayout = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {/* Custom rectangular header (no rounded corners) */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Module Marketplace</Text>
            </View>

            <View style={styles.container}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "transparent" },
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{
                            title: "Module Marketplace",
                            animation: "slide_from_right",
                        }}
                    />
                </Stack>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingTop: 20, // Space for status bar
        paddingBottom: 20,
        paddingHorizontal: 20,
        width: "100%",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 20,
    },
});

export default MarketplaceLayout;
