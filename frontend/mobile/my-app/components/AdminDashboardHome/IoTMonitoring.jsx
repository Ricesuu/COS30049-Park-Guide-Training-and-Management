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
} from "react-native";
import { fetchData } from "../../src/api/api";

const IoTMonitoring = forwardRef((props, ref) => {
    const [iotData, setIoTData] = useState([]); // Initialize as an array
    const [loading, setLoading] = useState(true); // For initial loading
    const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh
    const [error, setError] = useState(null);

    const loadIoTData = async (isRefreshing = false) => {
        try {
            console.log("Fetching IoT data...");
            const response = await fetchData("/iot-monitoring"); // Fetch data from the API

            // Update the state with the fetched data
            setIoTData(response || []); // Use the response directly or fallback to an empty array
            setError(null); // Clear any previous errors
        } catch (err) {
            setError("Failed to load IoT data");
            console.error(err);
        } finally {
            if (isRefreshing) {
                setRefreshing(false); // Stop pull-to-refresh
            } else {
                setLoading(false); // Stop initial loading
            }
        }
    };

    useImperativeHandle(ref, () => ({
        refreshIoTData: () => loadIoTData(true), // Expose this function to the parent
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
                <Text style={styles.title}>IoT Monitoring</Text>
                <View style={styles.row}>
                    <View style={styles.card}>
                        <Text
                            style={[
                                styles.value,
                                getLatestSensorValue("temperature") ===
                                    "No readings today" && styles.smallValue,
                            ]}
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
                            style={[
                                styles.value,
                                getLatestSensorValue("humidity") ===
                                    "No readings today" && styles.smallValue,
                            ]}
                        >
                            {getLatestSensorValue("humidity") ===
                            "No readings today"
                                ? "No readings today"
                                : `${getLatestSensorValue("humidity")}${
                                      getLatestSensorValue("humidity") !== "N/A"
                                          ? "%"
                                          : ""
                                  }`}
                        </Text>
                        <Text style={styles.label}>Humidity</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.card}>
                        <Text
                            style={[
                                styles.value,
                                getLatestSensorValue("soil moisture") ===
                                    "No readings today" && styles.smallValue,
                            ]}
                        >
                            {getLatestSensorValue("soil moisture") ===
                            "No readings today"
                                ? "No readings today"
                                : `${getLatestSensorValue("soil moisture")}${
                                      getLatestSensorValue("soil moisture") !==
                                      "N/A"
                                          ? "%"
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
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
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
        fontSize: 18, // Smaller font size for "No readings today"
        fontWeight: "bold", // Optional: make it less bold
        textAlign: "center", // Center the text
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
});

export default IoTMonitoring;
