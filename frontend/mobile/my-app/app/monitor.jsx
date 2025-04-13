import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import MonitoringCard from "../components/AdminDashboardMonitoring/MonitoringCard";
import AlertCard from "../components/AdminDashboardMonitoring/AlertCard";

const IoTMonitoringPage = () => {
    const [alerts, setAlerts] = useState([
        { id: "1", message: "High temperature detected in Zone A!" },
        { id: "2", message: "Low soil moisture in Zone B!" },
        { id: "3", message: "Unusual motion detected near Gate 3!" },
        { id: "4", message: "Humidity levels dropping in Zone C!" },
        { id: "5", message: "Soil moisture sensor malfunction in Zone D!" },
        { id: "6", message: "Temperature sensor offline in Zone E!" },
    ]);

    const handleRemoveAlert = (id) => {
        setAlerts((prevAlerts) =>
            prevAlerts.filter((alert) => alert.id !== id)
        );
    };

    const handlePress = (type) => {
        Alert.alert(
            `${type} Trends`,
            `Navigate to the historical trends page for ${type}.`
        );
        // Navigate to a detailed trends page (to be implemented)
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            {/* Header */}
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
                {/* Monitored Items Section */}
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 10,
                        color: "#333",
                    }}
                >
                    Monitored Items
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        marginBottom: 20,
                    }}
                >
                    <MonitoringCard
                        type="Temperature"
                        value="25°C"
                        onPress={() => handlePress("Temperature")}
                    />
                    <MonitoringCard
                        type="Humidity"
                        value="45%"
                        onPress={() => handlePress("Humidity")}
                    />
                    <MonitoringCard
                        type="Soil Moisture"
                        value="30%"
                        onPress={() => handlePress("Soil Moisture")}
                    />
                    <MonitoringCard
                        type="Motion Detection"
                        value="No Motion"
                        onPress={() => handlePress("Motion Detection")}
                    />
                </View>
                {/* Alerts Section */}
                <View style={{ marginBottom: 120 }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            marginBottom: 10,
                            color: "#333",
                        }}
                    >
                        Alerts
                    </Text>
                    {alerts.map((alert) => (
                        <AlertCard
                            key={alert.id}
                            message={alert.message}
                            onRemove={() => handleRemoveAlert(alert.id)} // Pass the remove handler
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default IoTMonitoringPage;
