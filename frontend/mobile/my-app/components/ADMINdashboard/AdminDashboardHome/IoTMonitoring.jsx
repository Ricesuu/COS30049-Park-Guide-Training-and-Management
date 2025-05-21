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
import { fetchData } from "../../../src/api/api";
import { useNavigation } from "expo-router";

const IoTMonitoring = forwardRef((props, ref) => {
    const navigation = useNavigation();
    const [iotData, setIoTData] = useState([]);
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [parks, setParks] = useState([]);
    const [selectedParkId, setSelectedParkId] = useState(null);
    const [selectedParkName, setSelectedParkName] = useState("");

    const loadIoTData = async (isRefreshing = false) => {
        try {
            console.log("Fetching IoT data...");
            const iotResponse = await fetchData(
                `/iot-monitoring${
                    selectedParkId ? `?park=${selectedParkId}` : ""
                }`
            );
            const alertsResponse = await fetchData(
                `/active-alerts${
                    selectedParkId ? `?park=${selectedParkId}` : ""
                }`
            );

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

    const loadParks = async () => {
        try {
            console.log("Fetching parks...");
            const parksResponse = await fetchData("/parks");
            setParks(parksResponse || []);

            // Set default park to the first one in the list
            if (parksResponse && parksResponse.length > 0) {
                const firstPark = parksResponse[0];
                setSelectedParkId(firstPark.park_id.toString());
                setSelectedParkName(firstPark.park_name);
                console.log(`Default park set to: ${firstPark.park_name}`);
            }
        } catch (err) {
            console.error("Failed to load parks", err);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshIoTData: () => loadIoTData(true),
    }));

    useEffect(() => {
        // Initial parks load
        loadParks();
    }, []);

    // Load data when selected park changes
    useEffect(() => {
        if (selectedParkId) {
            loadIoTData();

            // Set up polling every 60 seconds
            const interval = setInterval(() => {
                loadIoTData();
            }, 60000); // 60,000 ms = 60 seconds

            // Cleanup interval on component unmount
            return () => clearInterval(interval);
        }
    }, [selectedParkId]);

    const handleParkSelection = (parkId, parkName) => {
        setSelectedParkId(parkId);
        setSelectedParkName(parkName);
        // Reset loading state when changing parks
        setLoading(true);
    };

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
        const isToday = mostRecentDate >= today; // Return "N/A" if the latest reading is not from today
        if (!isToday) {
            return "N/A";
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
                                getLatestSensorValue("temperature") === "N/A"
                                    ? styles.smallValue
                                    : styles.value
                            }
                        >
                            {`${getLatestSensorValue("temperature")}${
                                getLatestSensorValue("temperature") !== "N/A"
                                    ? "°C"
                                    : ""
                            }`}
                        </Text>
                        <Text style={styles.label}>Temperature</Text>
                    </View>

                    <View style={styles.card}>
                        <Text
                            style={
                                getLatestSensorValue("humidity") === "N/A"
                                    ? styles.smallValue
                                    : styles.value
                            }
                        >
                            {`${getLatestSensorValue("humidity")}${
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
                            style={
                                getLatestSensorValue("soil moisture") === "N/A"
                                    ? styles.smallValue
                                    : styles.value
                            }
                        >
                            {`${getLatestSensorValue("soil moisture")}${
                                getLatestSensorValue("soil moisture") !== "N/A"
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

                {/* Park selection moved below IoT cards */}
                {selectedParkName ? (
                    <View style={styles.parkInfoContainer}>
                        <Text style={styles.parkInfoText}>
                            Monitoring:{" "}
                            <Text style={styles.parkName}>
                                {selectedParkName}
                            </Text>
                        </Text>
                        {parks.length > 1 ? (
                            <TouchableOpacity
                                style={styles.changeParkButton}
                                onPress={() => {
                                    // Find the next park in the array (cycle through parks)
                                    const currentIndex = parks.findIndex(
                                        (park) =>
                                            park.park_id.toString() ===
                                            selectedParkId
                                    );
                                    const nextIndex =
                                        (currentIndex + 1) % parks.length;
                                    const nextPark = parks[nextIndex];
                                    handleParkSelection(
                                        nextPark.park_id.toString(),
                                        nextPark.park_name
                                    );
                                }}
                            >
                                <Text style={styles.changeParkText}>
                                    Change Park
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                ) : null}

                {activeAlerts.length > 0 ? (
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
                ) : null}
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
        justifyContent: "center", // Added to vertically center content
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
        color: "#666",
        opacity: 0.8,
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
    parkInfoContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    parkInfoText: {
        fontSize: 16,
        color: "#333",
    },
    parkName: {
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    changeParkButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "rgb(22, 163, 74)",
        borderRadius: 5,
    },
    changeParkText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default IoTMonitoring;
