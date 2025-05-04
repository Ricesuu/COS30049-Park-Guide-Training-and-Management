import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from "react-native";
import MonitoringCard from "../../components/AdminDashboardMonitoring/MonitoringCard";
import AlertCard from "../../components/AdminDashboardMonitoring/AlertCard";
import { useNavigation } from "expo-router";
import { fetchData } from "../../src/api/api";

const IoTMonitoringPage = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [iotData, setIotData] = useState([]);
    const [error, setError] = useState(null);

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

    // Fetch IoT monitoring data
    const fetchMonitoringData = async (isRefreshing = false) => {
        try {
            console.log("Fetching IoT monitoring data...");
            const response = await fetchData("/iot-monitoring");

            setIotData(response || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching IoT monitoring data:", err);
            setError("Failed to load IoT monitoring data. Please try again.");
        } finally {
            setLoading(false);
            if (isRefreshing) {
                setRefreshing(false);
            }
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchMonitoringData();

        // Set up periodic refresh every 60 seconds for real-time monitoring
        const interval = setInterval(() => {
            fetchMonitoringData();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // Pull-to-refresh handler
    const onRefresh = () => {
        setRefreshing(true);
        fetchMonitoringData(true);
    };

    // Update the handlePress function to only show today's data
    const handlePress = (type) => {
        // Convert type to lowercase for consistent comparison
        const typeLower = type.toLowerCase();

        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter data for the selected sensor type AND only today's date
        const sensorData = iotData.filter((sensor) => {
            // Check if it matches the sensor type
            const isCorrectType = sensor.sensor_type === typeLower;

            // Check if the timestamp is from today
            const sensorDate = new Date(sensor.recorded_at);
            const isToday = sensorDate >= today;

            return isCorrectType && isToday;
        });

        // Sort by timestamp ascending
        const sortedData = sensorData.sort(
            (a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)
        );

        // Prepare data for chart display
        const labels = sortedData.map((item) => {
            const date = new Date(item.recorded_at);
            return `${date.getHours()}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
        });

        // Format values based on sensor type
        let values;
        if (typeLower === "motion") {
            values = sortedData.map((item) =>
                item.recorded_value.toLowerCase() === "detected" ? 1 : 0
            );
        } else {
            values = sortedData.map((item) => {
                // Remove any non-numeric characters and convert to float
                const numericValue = item.recorded_value.replace(
                    /[^\d.-]/g,
                    ""
                );
                return parseFloat(numericValue) || 0;
            });
        }

        // If we have data, navigate to the trends page
        if (labels.length > 0) {
            navigation.navigate("Trends", {
                type,
                data: { labels, values },
            });
        } else {
            // Handle the case where no data is available for today
            Alert.alert("No Data", `No data available for ${type} today.`, [
                { text: "OK" },
            ]);
        }
    };

    // Function to remove an alert
    const handleRemoveAlert = (index) => {
        setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
    };

    // Helper function to get the latest value of a specific sensor type
    const getLatestSensorValue = (sensorType) => {
        if (!iotData || iotData.length === 0) return "N/A";

        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find values for the given sensor type
        const matchingSensors = iotData.filter(
            (sensor) => sensor.sensor_type === sensorType
        );

        if (matchingSensors.length === 0) return "N/A";

        // Sort by recorded_at in descending order to get the most recent first
        const sortedSensors = matchingSensors.sort(
            (a, b) => new Date(b.recorded_at) - new Date(a.recorded_at)
        );

        // Check if the most recent reading is from today
        const mostRecentDate = new Date(sortedSensors[0].recorded_at);
        const isToday = mostRecentDate >= today;

        // Return "No readings today" if the latest reading is not from today
        if (!isToday) {
            return "No readings today";
        }

        return sortedSensors[0].recorded_value;
    };

    // Get the count of motion detections for the current day
    const getMotionDetectionCount = () => {
        if (!iotData || iotData.length === 0) return "0";

        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter motion sensors where motion was detected today
        const todayMotions = iotData.filter((sensor) => {
            // Check if it's a motion sensor and value indicates detection
            const isMotionSensor = sensor.sensor_type === "motion";
            const isDetected =
                sensor.recorded_value.toLowerCase() === "detected";

            // Check if the timestamp is from today
            const sensorDate = new Date(sensor.recorded_at);
            const isToday = sensorDate >= today;

            return isMotionSensor && isDetected && isToday;
        });

        return todayMotions.length.toString();
    };

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="rgb(22, 163, 74)" />
                <Text style={{ marginTop: 10 }}>
                    Loading monitoring data...
                </Text>
            </View>
        );
    }

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

            <ScrollView
                contentContainerStyle={{ padding: 10 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["rgb(22, 163, 74)"]}
                    />
                }
            >
                {error && (
                    <Text
                        style={{
                            color: "red",
                            textAlign: "center",
                            marginBottom: 10,
                        }}
                    >
                        {error}
                    </Text>
                )}

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
                        value={
                            getLatestSensorValue("temperature") ===
                            "No readings today"
                                ? "No readings today"
                                : `${getLatestSensorValue("temperature")}${
                                      getLatestSensorValue("temperature") !==
                                      "N/A"
                                          ? "°C"
                                          : ""
                                  }`
                        }
                        onPress={() => handlePress("temperature")}
                        style={{ width: "48%" }}
                    />
                    <MonitoringCard
                        type="Humidity"
                        value={
                            getLatestSensorValue("humidity") ===
                            "No readings today"
                                ? "No readings today"
                                : `${getLatestSensorValue("humidity")}${
                                      getLatestSensorValue("humidity") !== "N/A"
                                          ? "%"
                                          : ""
                                  }`
                        }
                        onPress={() => handlePress("humidity")}
                        style={{ width: "48%" }}
                    />
                    <MonitoringCard
                        type="Soil Moisture"
                        value={
                            getLatestSensorValue("soil moisture") ===
                            "No readings today"
                                ? "No readings today"
                                : `${getLatestSensorValue("soil moisture")}${
                                      getLatestSensorValue("soil moisture") !==
                                      "N/A"
                                          ? "%"
                                          : ""
                                  }`
                        }
                        onPress={() => handlePress("soil moisture")}
                        style={{ width: "48%" }}
                    />
                    <MonitoringCard
                        type="Motion Detection"
                        value={`${getMotionDetectionCount()} motion(s) today`}
                        onPress={() => handlePress("motion")}
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
                        onRemove={() => handleRemoveAlert(index)}
                        style={{ marginBottom: 10 }}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default IoTMonitoringPage;
