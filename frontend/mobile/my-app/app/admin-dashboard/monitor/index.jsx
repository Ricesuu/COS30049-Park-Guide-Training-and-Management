import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IoTMonitoringPage from "../../../components/ADMINdashboard/AdminDashboardMonitoring/IoTMonitoringPage";
import ThresholdSettingsPage from "../../../components/ADMINdashboard/AdminDashboardMonitoring/ThresholdSettingsPage";
import TrendsPage from "./trends";

const Stack = createNativeStackNavigator();

const MonitorStack = () => {
    return (
        <Stack.Navigator>
            {/* Default screen for the monitor tab */}
            <Stack.Screen
                name="IoTMonitoring"
                component={IoTMonitoringPage}
                options={{ headerShown: false }}
            />
            {/* Historical Trends page */}
            <Stack.Screen
                name="Trends"
                component={TrendsPage}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "rgb(22, 163, 74)",
                    },
                    headerTitleStyle: {
                        fontSize: 24,
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        paddingVertical: 20,
                    },
                    headerTintColor: "white", // Set back button color to white
                }}
            />
            {/* Alert Threshold Settings page */}
            <Stack.Screen
                name="ThresholdSettings"
                component={ThresholdSettingsPage}
                options={{
                    headerShown: true,
                    title: "Alert Thresholds",
                    headerStyle: {
                        backgroundColor: "rgb(22, 163, 74)",
                    },
                    headerTitleStyle: {
                        fontSize: 24,
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        paddingVertical: 20,
                    },
                    headerTintColor: "white", // Set back button color to white
                }}
            />
        </Stack.Navigator>
    );
};

export default MonitorStack;
