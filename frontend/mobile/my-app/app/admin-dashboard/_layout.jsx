import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { BackHandler, Alert, LogBox } from "react-native";
import MainTabBar from "../../components/ADMINdashboard/MainTabBar";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const _layout = () => {
    const router = useRouter();

    // Handle back button press
    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => BackHandler.exitApp(),
                },
            ]);
            return true; // Prevents default behavior (exiting the app)
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

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
