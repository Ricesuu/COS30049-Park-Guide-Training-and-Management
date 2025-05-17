import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import Header from "../../../components/PGdashboard/PGDashboardHome/Header";

/**
 * Layout component for the Module section
 * This provides a consistent layout wrapper for all module-related pages
 */
const ModuleLayout = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <Header />
            <View style={styles.dashboard}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "transparent" },
                    }}
                >
                    {/* The default screen for modules (user's enrolled modules) */}
                    <Stack.Screen
                        name="index"
                        options={{
                            title: "Your Modules",
                            animation: "slide_from_right",
                        }}
                    />{" "}
                    {/* Quiz page for modules */}
                    <Stack.Screen
                        name="quiz"
                        options={{
                            title: "Module Quiz",
                            animation: "slide_from_bottom",
                        }}
                    />
                    {/* Module marketplace page */}
                    <Stack.Screen
                        name="marketplace"
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
    dashboard: {
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -5,
        paddingBottom: -20,
        zIndex: 1,
        elevation: 10,
        padding: 20,
        flex: 1,
    },
});

export default ModuleLayout;
