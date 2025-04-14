import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IoTMonitoringPage from "../../components/AdminDashboardMonitoring/IoTMonitoringPage";
import TrendsPage from "./trends";

const Stack = createNativeStackNavigator();

const MonitorStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Default screen for the monitor tab */}
            <Stack.Screen name="IoTMonitoring" component={IoTMonitoringPage} />
            {/* Historical Trends page */}
            <Stack.Screen name="Trends" component={TrendsPage} />
        </Stack.Navigator>
    );
};

export default MonitorStack;
