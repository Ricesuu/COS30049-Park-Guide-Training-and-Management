import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { fetchData } from "../../src/api/api";

const IoTMonitoring = () => {
    const [iotData, setIoTData] = useState([]); // Initialize as an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadIoTData = async () => {
            try {
                const data = await fetchData("/iot-monitoring");
                setIoTData(data); // Store the fetched array
                setError(null); // Clear any previous errors
            } catch (err) {
                setError("Failed to load IoT data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Initial data load
        loadIoTData();

        // Set up polling every 10 seconds
        const interval = setInterval(() => {
            loadIoTData();
        }, 10000); // 10,000 ms = 10 seconds

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
        <View>
            <Text style={styles.title}>IoT Monitoring</Text>
            <View style={styles.row}>
                <View style={styles.card}>
                    <Text style={[styles.value, { fontSize: 28 }]}>
                        {iotData.find(
                            (sensor) => sensor.sensor_type === "temperature"
                        )?.recorded_value || "N/A"}
                        °C
                    </Text>
                    <Text style={[styles.label, { fontSize: 14 }]}>
                        Temperature
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={[styles.value, { fontSize: 28 }]}>
                        {iotData.find(
                            (sensor) => sensor.sensor_type === "humidity"
                        )?.recorded_value || "N/A"}
                    </Text>
                    <Text style={[styles.label, { fontSize: 14 }]}>
                        Humidity
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.card}>
                    <Text style={[styles.value, { fontSize: 28 }]}>
                        {iotData.find(
                            (sensor) => sensor.sensor_type === "soil moisture"
                        )?.recorded_value || "N/A"}
                    </Text>
                    <Text style={[styles.label, { fontSize: 14 }]}>
                        Soil Moisture
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={[styles.value, { fontSize: 28 }]}>
                        {
                            iotData.filter(
                                (sensor) => sensor.sensor_type === "motion"
                            ).length
                        }
                    </Text>
                    <Text style={[styles.label, { fontSize: 14 }]}>
                        Motion Detected
                    </Text>
                </View>
            </View>
        </View>
    );
};

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
