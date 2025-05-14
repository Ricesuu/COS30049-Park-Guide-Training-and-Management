import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { BackHandler, Alert } from "react-native";
import PGMainTabBar from "../../components/PGdashboard/PGMainTabBar";

const PGDashboardLayout = () => {
    const router = useRouter();

    // Handle back button press
    useEffect(() => {
        const backAction = () => {
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
                        text: "Yes", 
                        onPress: () => BackHandler.exitApp() 
                    }
                ]
            );
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
            tabBar={(props) => <PGMainTabBar {...props} />}
            style={{ zIndex: 999 }}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="module" options={{ title: "Module" }} />
            <Tabs.Screen name="certificate" options={{ title: "Certificate" }} />
            <Tabs.Screen name="plantinfo" options={{ title: "Plant Info" }} />
            <Tabs.Screen name="identification" options={{ title: "Identification" }} />
            <Tabs.Screen name="payment" options={{ title: "Payment" }} />
            <Tabs.Screen name="quiz" options={{ title: "Quiz" }} />
        </Tabs>
    );
};

export default PGDashboardLayout;
