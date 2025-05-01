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

        // Set up polling every 10 seconds
        const interval = setInterval(() => {
            loadIoTData();
        }, 60000); // 60,000 ms = 60 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

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
                        <Text style={styles.value}>
                            {iotData.find(
                                (sensor) => sensor.sensor_type === "temperature"
                            )?.recorded_value || "N/A"}
                            °C
                        </Text>
                        <Text style={styles.label}>Temperature</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.value}>
                            {iotData.find(
                                (sensor) => sensor.sensor_type === "humidity"
                            )?.recorded_value || "N/A"}
                        </Text>
                        <Text style={styles.label}>Humidity</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.card}>
                        <Text style={styles.value}>
                            {iotData.find(
                                (sensor) =>
                                    sensor.sensor_type === "soil moisture"
                            )?.recorded_value || "N/A"}
                        </Text>
                        <Text style={styles.label}>Soil Moisture</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.value}>
                            {iotData.filter(
                                (sensor) => sensor.sensor_type === "motion"
                            ).length || 0}
                        </Text>
                        <Text style={styles.label}>Motion Detected</Text>
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
    label: {
        fontSize: 16,
        color: "#666",
        marginTop: 5,
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
