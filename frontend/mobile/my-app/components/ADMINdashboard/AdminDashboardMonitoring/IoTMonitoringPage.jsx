import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MonitoringCard from "./MonitoringCard";
import AlertCard from "./AlertCard";
import AlertTestingTool from "./AlertTestingTool";
import { useNavigation } from "expo-router";
import { fetchData } from "../../../src/api/api";
import { Ionicons } from "@expo/vector-icons";

const IoTMonitoringPage = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [iotData, setIotData] = useState([]);
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [thresholds, setThresholds] = useState([]);
    const [error, setError] = useState(null);
    const [showTestingTool, setShowTestingTool] = useState(false);

    // Add state for parks and selected park
    const [parks, setParks] = useState([]);
    const [selectedParkId, setSelectedParkId] = useState("all");

    // Fetch IoT monitoring data
    const fetchMonitoringData = async (
        isRefreshing = false,
        showMessage = false
    ) => {
        try {
            console.log("==== MONITORING DATA FETCH START ====");
            console.log("Fetching IoT monitoring data...");
            const iotResponse = await fetchData(
                `/iot-monitoring?park=${selectedParkId}`
            );
            console.log(`Fetched ${iotResponse?.length || 0} IoT records`);

            const alertsResponse = await fetchData(
                `/active-alerts?park=${selectedParkId}`
            );
            console.log(`Fetched ${alertsResponse?.length || 0} active alerts`);

            const thresholdsResponse = await fetchData(
                `/alert-thresholds?park=${selectedParkId}`
            );
            console.log(
                `Fetched ${thresholdsResponse?.length || 0} alert thresholds`
            );
            console.log("==== MONITORING DATA FETCH COMPLETE ====");

            setIotData(iotResponse || []);
            setActiveAlerts(alertsResponse || []);
            setThresholds(thresholdsResponse || []);
            setError(null);

            // Show success message when refreshing after test data submission
            if (showMessage) {
                Alert.alert(
                    "Data Refreshed",
                    "The monitoring data has been refreshed with the latest values."
                );
            }
        } catch (err) {
            console.error("==== MONITORING DATA FETCH ERROR ====");
            console.error("Error fetching IoT monitoring data:", err);
            console.error("Error details:", {
                message: err.message,
                stack: err.stack,
            });
            console.error("==== END ERROR LOG ====");

            setError("Failed to load IoT monitoring data. Please try again.");
        } finally {
            setLoading(false);
            if (isRefreshing) {
                setRefreshing(false);
            }
        }
    };

    // Callback function for AlertTestingTool
    const handleTestDataSubmitted = () => {
        console.log("==== TEST DATA REFRESH START ====");
        console.log("Test data submitted, refreshing data...");
        // Fetch data with refreshing indicator and show success message
        setRefreshing(true);
        fetchMonitoringData(true, true);
        console.log("==== TEST DATA REFRESH END ====");
    };

    // Load data on component mount and when selected park changes
    useEffect(() => {
        console.log(`Park selection changed to: ${selectedParkId}`);
        fetchMonitoringData();
    }, [selectedParkId]);

    useEffect(() => {
        console.log("IoTMonitoringPage mounted, fetching initial data");

        // Fetch parks data
        const fetchParks = async () => {
            try {
                const parksResponse = await fetchData("/parks");
                setParks(parksResponse || []);

                // Set the default park to the first park in the database
                if (parksResponse && parksResponse.length > 0) {
                    setSelectedParkId(parksResponse[0].park_id.toString());
                    console.log(
                        `Default park set to: ${parksResponse[0].park_name} (ID: ${parksResponse[0].park_id})`
                    );
                }
            } catch (err) {
                console.error("Error fetching parks data:", err);
            }
        };

        fetchParks();

        // Set up periodic refresh every 60 seconds for real-time monitoring
        const interval = setInterval(() => {
            console.log("Periodic refresh timer triggered");
            fetchMonitoringData();
        }, 60000);

        return () => {
            console.log("IoTMonitoringPage unmounted, clearing interval");
            clearInterval(interval);
        };
    }, []);

    // Pull-to-refresh handler
    const onRefresh = () => {
        console.log("Manual pull-to-refresh triggered");
        setRefreshing(true);
        fetchMonitoringData(true);
    };

    // Get threshold for a specific sensor type
    const getThresholdForSensor = (sensorType) => {
        if (!thresholds || thresholds.length === 0) return null;

        const threshold = thresholds.find(
            (t) => t.sensor_type.toLowerCase() === sensorType.toLowerCase()
        );

        return threshold || null;
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

    // Function to handle alert dismissal
    const handleDismissAlert = async (alertId) => {
        try {
            console.log(`Dismissing alert with ID: ${alertId}`);
            await fetchData("/active-alerts", {
                method: "DELETE",
                body: JSON.stringify({ alert_id: alertId }),
            });
            console.log(`Successfully dismissed alert with ID: ${alertId}`);

            // Remove the alert from state
            setActiveAlerts((prevAlerts) =>
                prevAlerts.filter((alert) => alert.alert_id !== alertId)
            );
        } catch (err) {
            console.error(`Error dismissing alert with ID ${alertId}:`, err);
            Alert.alert("Error", "Failed to dismiss alert. Please try again.");
        }
    };

    // Navigate to threshold settings page
    const navigateToThresholdSettings = () => {
        navigation.navigate("ThresholdSettings");
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

    // Format alert severity for display
    const getSeverityStyle = (severity) => {
        switch (severity.toLowerCase()) {
            case "high":
                return { color: "red" };
            case "medium":
                return { color: "orange" };
            case "low":
                return { color: "blue" };
            default:
                return { color: "gray" };
        }
    };

    // Helper function to get display-friendly sensor names
    function getSensorDisplayName(sensorType) {
        switch (sensorType.toLowerCase()) {
            case "temperature":
                return "Temperature";
            case "humidity":
                return "Humidity";
            case "soil moisture":
                return "Soil Moisture";
            case "motion":
                return "Motion Detection";
            default:
                return sensorType;
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <Text
                style={{
                    fontSize: 24,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 20,
                }}
            >
                IoT Monitoring
            </Text>
            <View
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    marginHorizontal: 15,
                    marginBottom: 20,
                    borderRadius: 8,
                    padding: 8,
                }}
            >
                <Text
                    style={{
                        color: "white",
                        fontWeight: "500",
                        marginBottom: 4,
                    }}
                >
                    Monitoring Park:
                </Text>
                <Picker
                    selectedValue={selectedParkId}
                    onValueChange={(itemValue) => setSelectedParkId(itemValue)}
                    style={{
                        backgroundColor: "white",
                        borderRadius: 8,
                    }}
                    dropdownIconColor="#4a5568"
                >
                    {parks.map((park) => (
                        <Picker.Item
                            key={park.park_id}
                            label={park.park_name}
                            value={park.park_id.toString()}
                        />
                    ))}
                </Picker>
            </View>
            <ScrollView
                style={{
                    backgroundColor: "white",
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    paddingTop: 20,
                    paddingHorizontal: 15,
                    flex: 1,
                }}
                contentContainerStyle={{ paddingBottom: 120 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["rgb(22, 163, 74)"]}
                    />
                }
            >
                {loading ? (
                    <View
                        style={{
                            paddingVertical: 50,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ActivityIndicator
                            size="large"
                            color="rgb(22, 163, 74)"
                        />
                        <Text style={{ marginTop: 10 }}>
                            Loading IoT data...
                        </Text>
                    </View>
                ) : (
                    <>
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

                        <Text className="text-xl font-bold text-gray-800 mb-4">
                            Current Sensor Readings
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                            }}
                        >
                            <MonitoringCard
                                type="Temperature"
                                value={
                                    getLatestSensorValue("temperature") ===
                                    "No readings today"
                                        ? "No readings today"
                                        : `${getLatestSensorValue(
                                              "temperature"
                                          )}${
                                              getLatestSensorValue(
                                                  "temperature"
                                              ) !== "N/A"
                                                  ? ""
                                                  : ""
                                          }`
                                }
                                threshold={getThresholdForSensor("temperature")}
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
                                              getLatestSensorValue(
                                                  "humidity"
                                              ) !== "N/A"
                                                  ? ""
                                                  : ""
                                          }`
                                }
                                threshold={getThresholdForSensor("humidity")}
                                onPress={() => handlePress("humidity")}
                                style={{ width: "48%" }}
                            />
                            <MonitoringCard
                                type="Soil Moisture"
                                value={
                                    getLatestSensorValue("soil moisture") ===
                                    "No readings today"
                                        ? "No readings today"
                                        : `${getLatestSensorValue(
                                              "soil moisture"
                                          )}${
                                              getLatestSensorValue(
                                                  "soil moisture"
                                              ) !== "N/A"
                                                  ? ""
                                                  : ""
                                          }`
                                }
                                threshold={getThresholdForSensor(
                                    "soil moisture"
                                )}
                                onPress={() => handlePress("soil moisture")}
                                style={{ width: "48%" }}
                            />
                            <MonitoringCard
                                type="Motion Detection"
                                value={`${getMotionDetectionCount()} motion(s) today`}
                                threshold={getThresholdForSensor("motion")}
                                onPress={() => handlePress("motion")}
                                style={{ width: "48%" }}
                            />
                        </View>

                        <Text className="text-2xl font-bold text-gray-800 mt-6 mb-4">
                            Active Alerts{" "}
                            {activeAlerts.length > 0 &&
                                `(${activeAlerts.length})`}
                        </Text>

                        {activeAlerts.length === 0 ? (
                            <View style={{ padding: 20, alignItems: "center" }}>
                                <Text style={{ color: "#666" }}>
                                    No active alerts at this time
                                </Text>
                            </View>
                        ) : (
                            activeAlerts.map((alert) => (
                                <AlertCard
                                    key={alert.alert_id}
                                    title={`${
                                        alert.park_name || "Park"
                                    }: ${getSensorDisplayName(
                                        alert.sensor_type
                                    )}`}
                                    description={`${alert.message} (${alert.recorded_value})`}
                                    severity={alert.severity}
                                    onRemove={() =>
                                        handleDismissAlert(alert.alert_id)
                                    }
                                    style={{ marginBottom: 10 }}
                                />
                            ))
                        )}

                        {/* Threshold Settings Button */}
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={navigateToThresholdSettings}
                        >
                            <Ionicons
                                name="settings-outline"
                                size={24}
                                color="white"
                            />
                            <Text style={styles.settingsButtonText}>
                                Configure Alert Thresholds
                            </Text>
                        </TouchableOpacity>

                        {/* Toggle button for showing/hiding the testing tool */}
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => setShowTestingTool((prev) => !prev)}
                        >
                            <Text style={styles.toggleButtonText}>
                                {showTestingTool
                                    ? "Hide Testing Tool"
                                    : "Show Testing Tool"}
                            </Text>
                        </TouchableOpacity>

                        {/* Conditionally render the testing tool and pass the refresh callback */}
                        {showTestingTool && (
                            <AlertTestingTool
                                onSubmitSuccess={handleTestDataSubmitted}
                            />
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    toggleButton: {
        backgroundColor: "rgb(22, 163, 74)",
        padding: 12,
        borderRadius: 8,
        marginVertical: 20,
        alignItems: "center",
    },
    toggleButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    settingsButton: {
        backgroundColor: "#3b82f6",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    settingsButtonText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 8,
    },
});

export default IoTMonitoringPage;
