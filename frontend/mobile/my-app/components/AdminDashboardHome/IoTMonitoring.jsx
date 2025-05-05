import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from "react-native";
import { fetchData } from "../../src/api/api";
import { useNavigation } from "expo-router";

const IoTMonitoring = forwardRef((props, ref) => {
    const navigation = useNavigation();
    const [iotData, setIoTData] = useState([]);
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const loadIoTData = async (isRefreshing = false) => {
        try {
            console.log("Fetching IoT data...");
            const iotResponse = await fetchData("/iot-monitoring");
            const alertsResponse = await fetchData("/active-alerts");

            setIoTData(iotResponse || []);
            setActiveAlerts(alertsResponse || []);
            setError(null);
        } catch (err) {
            setError("Failed to load IoT data");
            console.error(err);
        } finally {
            if (isRefreshing) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    };

    useImperativeHandle(ref, () => ({
        refreshIoTData: () => loadIoTData(true),
    }));

    useEffect(() => {
        // Initial data load
        loadIoTData();

        // Set up polling every 60 seconds
        const interval = setInterval(() => {
            loadIoTData();
        }, 60000); // 60,000 ms = 60 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Helper function to get the latest value of a specific sensor type, only showing today's data
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

    const handleViewAllMonitoring = () => {
        navigation.navigate("monitor");
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#333" />
                <Text>Loading IoT Data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => loadIoTData(true)}
                />
            }
        >
            <View>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>IoT Monitoring</Text>
                    <TouchableOpacity onPress={handleViewAllMonitoring}>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <View style={styles.card}>
                        <Text
                            style={
                                getLatestSensorValue("temperature") ===
                                "No readings today"
                                    ? styles.smallValue
                                    : styles.value
                            }
                        >
                            {getLatestSensorValue("temperature") ===
                            "No readings today"
                                ? "No readings today"
                                : `${getLatestSensorValue("temperature")}${
                                      getLatestSensorValue("temperature") !==
                                      "N/A"
                                          ? "°C"
                                          : ""
                                  }`}
                        </Text>
                        <Text style={styles.label}>Temperature</Text>
                    </View>

                    <View style={styles.card}>
                        <Text
                            style={
                                getLatestSensorValue("humidity") ===
                                "No readings today"
                                    ? styles.smallValue
                                    : styles.value
                            }
                        >
                            {getLatestSensorValue("humidity") ===
                            "No readings today"
                                ? "No readings today"
                                : `${getLatestSensorValue("humidity")}${
                                      getLatestSensorValue("humidity") !== "N/A"
                                          ? ""
                                          : ""
                                  }`}
                        </Text>
                        <Text style={styles.label}>Humidity</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.card}>
                        <Text
                            style={
                                getLatestSensorValue("soil moisture") ===
                                "No readings today"
                                    ? styles.smallValue
                                    : styles.value
                            }
                        >
                            {getLatestSensorValue("soil moisture") ===
                            "No readings today"
                                ? "No readings today"
                                : `${getLatestSensorValue("soil moisture")}${
                                      getLatestSensorValue("soil moisture") !==
                                      "N/A"
                                          ? ""
                                          : ""
                                  }`}
                        </Text>
                        <Text style={styles.label}>Soil Moisture</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.value}>
                            {getMotionDetectionCount()}
                        </Text>
                        <Text style={styles.label}>Motion Events Today</Text>
                    </View>
                </View>

                {activeAlerts.length > 0 && (
                    <View style={styles.alertsContainer}>
                        <Text style={styles.alertsTitle}>
                            Active Alerts ({activeAlerts.length})
                        </Text>
                        <TouchableOpacity
                            style={styles.alertBadge}
                            onPress={handleViewAllMonitoring}
                        >
                            <Text style={styles.alertBadgeText}>
                                {activeAlerts.length}{" "}
                                {activeAlerts.length === 1 ? "alert" : "alerts"}{" "}
                                require attention
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    viewAll: {
        color: "rgb(22, 163, 74)",
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 20,
        flex: 1,
        marginHorizontal: 5,
        alignItems: "center",
        elevation: 5,
    },
    value: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#333",
    },
    smallValue: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        color: "#666",
        marginTop: 5,
        textAlign: "center",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        color: "red",
        fontSize: 16,
    },
    alertsContainer: {
        marginTop: 10,
    },
    alertsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    alertBadge: {
        backgroundColor: "#FFEBEB",
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: "#FF8080",
    },
    alertBadgeText: {
        color: "#CC0000",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default IoTMonitoring;
