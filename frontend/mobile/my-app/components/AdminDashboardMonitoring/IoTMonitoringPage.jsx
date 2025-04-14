import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import MonitoringCard from "../../components/AdminDashboardMonitoring/MonitoringCard";
import AlertCard from "../../components/AdminDashboardMonitoring/AlertCard";
import { useNavigation } from "expo-router";

const IoTMonitoringPage = () => {
    const navigation = useNavigation();

    // State to manage alerts
    const [alerts, setAlerts] = useState([
        {
            title: "High Temperature Alert",
            description: "Temperature is above 30°C.",
        },
        {
            title: "Low Soil Moisture Alert",
            description: "Soil moisture is below 20%.",
        },
        {
            title: "Unauthorized Motion Detected",
            description: "Motion detected near sensitive plant areas.",
        },
    ]);

    const handlePress = (type) => {
        const historicalData = {
            Temperature: {
                labels: ["12 PM", "1 PM", "2 PM"],
                values: [25, 26, 27],
            },
            Humidity: {
                labels: ["12 PM", "1 PM", "2 PM"],
                values: [45, 50, 55],
            },
            "Soil Moisture": {
                labels: ["12 PM", "1 PM", "2 PM"],
                values: [30, 35, 40],
            },
            "Motion Detection": {
                labels: ["12 PM", "1 PM", "2 PM"],
                values: [0, 1, 0],
            },
        };

        navigation.navigate("Trends", {
            type,
            data: historicalData[type],
        });
    };

    // Function to remove an alert
    const handleRemoveAlert = (index) => {
        setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <Text
                style={{
                    fontSize: 24,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 20,
                    backgroundColor: "rgb(22, 163, 74)",
                }}
            >
                IoT Monitoring
            </Text>

            <ScrollView contentContainerStyle={{ padding: 10 }}>
                <Text className="text-2xl font-bold text-gray-800 mb-4">
                    Monitored Parameters
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    <MonitoringCard
                        type="Temperature"
                        value="25°C"
                        onPress={() => handlePress("Temperature")}
                        style={{ width: "48%" }}
                    />
                    <MonitoringCard
                        type="Humidity"
                        value="45%"
                        onPress={() => handlePress("Humidity")}
                        style={{ width: "48%" }}
                    />
                    <MonitoringCard
                        type="Soil Moisture"
                        value="30%"
                        onPress={() => handlePress("Soil Moisture")}
                        style={{ width: "48%" }}
                    />
                    <MonitoringCard
                        type="Motion Detection"
                        value="No Motion"
                        onPress={() => handlePress("Motion Detection")}
                        style={{ width: "48%" }}
                    />
                </View>

                <Text className="text-2xl font-bold text-gray-800 mt-6 mb-4">
                    Alerts
                </Text>
                {alerts.map((alert, index) => (
                    <AlertCard
                        key={index}
                        title={alert.title}
                        description={alert.description}
                        onRemove={() => handleRemoveAlert(index)} // Pass the remove handler
                        style={{ marginBottom: 10 }}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default IoTMonitoringPage;
