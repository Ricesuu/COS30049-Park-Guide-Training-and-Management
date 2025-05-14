import { AuthProvider } from "../contexts/AuthContext";
import Toast from "react-native-toast-message";
import { toastConfig } from "../lib/toastConfig";
import { Slot, Stack } from "expo-router";
import { BackHandler, Alert } from "react-native";
import React, { useEffect } from "react";

export default function Layout() {
    // Handle back button press
    useEffect(() => {
        const backAction = () => {
            // This will trigger when the user presses the back button
            // For now, show a confirmation dialog instead of exiting immediately
            Alert.alert(
                "Hold on!", 
                "Are you sure you want to exit the app?",
                [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { 
                        text: "YES", 
                        onPress: () => BackHandler.exitApp()
                    }
                ]
            );
            return true; // Prevents default behavior (exit app)
        };

        // Add back button listener
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        // Clean up the event listener when component unmounts
        return () => backHandler.remove();
    }, []);
    
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="forgot_password" />
                <Stack.Screen name="pg-dashboard" />
                <Stack.Screen name="admin-dashboard" />
            </Stack>
            <Toast config={toastConfig} />
        </AuthProvider>
    );
}
