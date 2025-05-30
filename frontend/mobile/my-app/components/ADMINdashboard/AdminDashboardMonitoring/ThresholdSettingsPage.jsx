import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    Alert,
    Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchData } from "../../../src/api/api";
import { useNavigation } from "expo-router";

const ThresholdSettingsPage = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [parks, setParks] = useState([]);
    const [thresholds, setThresholds] = useState([]);
    const [selectedPark, setSelectedPark] = useState(null);
    const [selectedSensor, setSelectedSensor] = useState("temperature");
    const [selectedThreshold, setSelectedThreshold] = useState(null);
    const [minThreshold, setMinThreshold] = useState("");
    const [maxThreshold, setMaxThreshold] = useState("");
    const [triggerMessage, setTriggerMessage] = useState("");
    const [severity, setSeverity] = useState("medium");
    const [isEnabled, setIsEnabled] = useState(true);
    const [error, setError] = useState(null);

    // Time range settings for motion detection (24-hour format)
    const [startTime, setStartTime] = useState("20:00");
    const [endTime, setEndTime] = useState("06:00");

    // Fetch parks and thresholds data
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch parks data
            const parksResponse = await fetchData("/parks");
            setParks(parksResponse || []);

            // Fetch thresholds data
            const thresholdsResponse = await fetchData("/alert-thresholds");
            setThresholds(thresholdsResponse || []);

            // Set default selected park if available
            if (parksResponse && parksResponse.length > 0) {
                setSelectedPark(parksResponse[0].park_id);
            }
        } catch (err) {
            console.error("Error fetching threshold settings data:", err);
            setError("Failed to load threshold settings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Update form when park or sensor changes
    useEffect(() => {
        if (selectedPark && selectedSensor) {
            const foundThreshold = thresholds.find(
                (t) =>
                    t.park_id === selectedPark &&
                    t.sensor_type.toLowerCase() === selectedSensor.toLowerCase()
            );

            setSelectedThreshold(foundThreshold);

            if (foundThreshold) {
                setMinThreshold(
                    foundThreshold.min_threshold !== null
                        ? String(foundThreshold.min_threshold)
                        : ""
                );
                setMaxThreshold(
                    foundThreshold.max_threshold !== null
                        ? String(foundThreshold.max_threshold)
                        : ""
                );
                setTriggerMessage(foundThreshold.trigger_message);
                setSeverity(foundThreshold.severity);
                setIsEnabled(foundThreshold.is_enabled);

                // Parse time range from trigger_message for motion detection
                if (
                    selectedSensor === "motion" &&
                    foundThreshold.trigger_message
                ) {
                    const timeRangeMatch = foundThreshold.trigger_message.match(
                        /(\d{1,2}:\d{2}) to (\d{1,2}:\d{2})/
                    );
                    if (timeRangeMatch) {
                        setStartTime(timeRangeMatch[1]);
                        setEndTime(timeRangeMatch[2]);
                    }
                }
            } else {
                resetForm();
            }
        }
    }, [selectedPark, selectedSensor, thresholds]);

    // Reset form to defaults
    const resetForm = () => {
        setMinThreshold("");
        setMaxThreshold("");
        setTriggerMessage("");
        setSeverity("medium");
        setIsEnabled(true);
        setStartTime("20:00");
        setEndTime("06:00");
    };

    // Handle form submission
    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            let finalTriggerMessage = triggerMessage;

            // For motion detection, include time range in the message
            if (selectedSensor === "motion") {
                finalTriggerMessage = `Motion detected between ${startTime} to ${endTime}`;
            }

            const thresholdData = {
                park_id: selectedPark,
                sensor_type: selectedSensor,
                min_threshold:
                    selectedSensor === "motion"
                        ? null
                        : minThreshold === ""
                        ? null
                        : parseFloat(minThreshold),
                max_threshold:
                    selectedSensor === "motion"
                        ? null
                        : maxThreshold === ""
                        ? null
                        : parseFloat(maxThreshold),
                trigger_message: finalTriggerMessage,
                severity: severity,
                is_enabled: isEnabled,
            };

            let response;

            if (selectedThreshold) {
                // Update existing threshold
                response = await fetchData(
                    `/alert-thresholds/${selectedThreshold.threshold_id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(thresholdData),
                    }
                );
                console.log("Updated threshold:", response);
            } else {
                // Create new threshold
                response = await fetchData("/alert-thresholds", {
                    method: "POST",
                    body: JSON.stringify(thresholdData),
                });
                console.log("Created new threshold:", response);
            }

            // Refresh thresholds data
            const thresholdsResponse = await fetchData("/alert-thresholds");
            setThresholds(thresholdsResponse || []);

            // Show success message
            Alert.alert(
                "Success",
                selectedThreshold
                    ? "Threshold settings updated successfully"
                    : "New threshold settings created successfully",
                [{ text: "OK" }]
            );
        } catch (err) {
            console.error("Error saving threshold settings:", err);
            setError("Failed to save threshold settings. Please try again.");
            Alert.alert(
                "Error",
                "Failed to save threshold settings. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // Render different form fields based on sensor type
    const renderSensorSpecificFields = () => {
        if (selectedSensor === "motion") {
            return (
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>
                        Motion Detection Time Range
                    </Text>
                    <Text style={styles.helpText}>
                        Set the time range when motion detection should trigger
                        alerts. Enter in 24-hour format (HH:MM).
                    </Text>

                    <View style={styles.timeRangeContainer}>
                        <View style={styles.timeInputContainer}>
                            <Text style={styles.label}>Start Time:</Text>
                            <TextInput
                                style={styles.timeInput}
                                value={startTime}
                                onChangeText={setStartTime}
                                placeholder="20:00"
                                keyboardType="default"
                            />
                        </View>

                        <View style={styles.timeInputContainer}>
                            <Text style={styles.label}>End Time:</Text>
                            <TextInput
                                style={styles.timeInput}
                                value={endTime}
                                onChangeText={setEndTime}
                                placeholder="06:00"
                                keyboardType="default"
                            />
                        </View>
                    </View>

                    <Text style={styles.noteText}>
                        Note: Motion will only trigger alerts between the
                        specified times. For example, 20:00 to 06:00 covers
                        nighttime hours.
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Threshold Values</Text>

                    <Text style={styles.label}>Minimum Threshold:</Text>
                    <TextInput
                        style={styles.input}
                        value={minThreshold}
                        onChangeText={setMinThreshold}
                        placeholder={`Enter minimum ${selectedSensor} value`}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Maximum Threshold:</Text>
                    <TextInput
                        style={styles.input}
                        value={maxThreshold}
                        onChangeText={setMaxThreshold}
                        placeholder={`Enter maximum ${selectedSensor} value`}
                        keyboardType="numeric"
                    />

                    <Text style={styles.noteText}>
                        Values outside these thresholds will trigger alerts.
                        Leave empty if no minimum or maximum limit is needed.
                    </Text>
                </View>
            );
        }
    };

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
                Alert Threshold Settings
            </Text>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color="rgb(22, 163, 74)"
                        />
                        <Text style={{ marginTop: 10 }}>
                            Loading threshold settings...
                        </Text>
                    </View>
                ) : (
                    <>
                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <View style={styles.formContainer}>
                            <View style={styles.formSection}>
                                <Text style={styles.sectionTitle}>
                                    General Settings
                                </Text>

                                <Text style={styles.label}>Park:</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedPark}
                                        onValueChange={(itemValue) =>
                                            setSelectedPark(itemValue)
                                        }
                                        style={styles.picker}
                                    >
                                        {parks.map((park) => (
                                            <Picker.Item
                                                key={park.park_id}
                                                label={park.park_name}
                                                value={park.park_id}
                                            />
                                        ))}
                                    </Picker>
                                </View>

                                <Text style={styles.label}>Sensor Type:</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedSensor}
                                        onValueChange={(itemValue) =>
                                            setSelectedSensor(itemValue)
                                        }
                                        style={styles.picker}
                                    >
                                        <Picker.Item
                                            label="Temperature"
                                            value="temperature"
                                        />
                                        <Picker.Item
                                            label="Humidity"
                                            value="humidity"
                                        />
                                        <Picker.Item
                                            label="Soil Moisture"
                                            value="soil moisture"
                                        />
                                        <Picker.Item
                                            label="Motion"
                                            value="motion"
                                        />
                                    </Picker>
                                </View>
                            </View>

                            {/* Sensor specific fields (rendered conditionally) */}
                            {renderSensorSpecificFields()}

                            <View style={styles.formSection}>
                                <Text style={styles.sectionTitle}>
                                    Alert Settings
                                </Text>

                                <Text style={styles.label}>Alert Message:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={triggerMessage}
                                    onChangeText={setTriggerMessage}
                                    placeholder="Enter alert message"
                                />

                                <Text style={styles.label}>
                                    Alert Severity:
                                </Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={severity}
                                        onValueChange={(itemValue) =>
                                            setSeverity(itemValue)
                                        }
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Low" value="low" />
                                        <Picker.Item
                                            label="Medium"
                                            value="medium"
                                        />
                                        <Picker.Item
                                            label="High"
                                            value="high"
                                        />
                                    </Picker>
                                </View>

                                <View style={styles.switchContainer}>
                                    <Text style={styles.label}>
                                        Enable Alert:
                                    </Text>
                                    <Switch
                                        value={isEnabled}
                                        onValueChange={setIsEnabled}
                                        trackColor={{
                                            false: "#767577",
                                            true: "#4ade80",
                                        }}
                                        thumbColor={
                                            isEnabled ? "#16a34a" : "#f4f3f4"
                                        }
                                    />
                                </View>
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.saveButton,
                                        saving && styles.disabledButton,
                                    ]}
                                    onPress={handleSave}
                                    disabled={saving}
                                >
                                    <Text style={styles.buttonText}>
                                        {saving ? "Saving..." : "Save Settings"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text style={styles.buttonText}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        flex: 1,
    },
    loadingContainer: {
        paddingVertical: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 30,
    },
    formSection: {
        backgroundColor: "#f9fafb",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#374151",
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: "500",
        color: "#4b5563",
    },
    pickerContainer: {
        backgroundColor: "#f3f4f6",
        borderRadius: 8,
        marginBottom: 15,
    },
    picker: {
        height: 50,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: "#f9fafb",
    },
    timeRangeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    timeInputContainer: {
        width: "48%",
    },
    timeInput: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#f9fafb",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    noteText: {
        fontStyle: "italic",
        color: "#6b7280",
        marginBottom: 10,
        fontSize: 14,
    },
    helpText: {
        color: "#6b7280",
        marginBottom: 15,
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        width: "48%",
    },
    saveButton: {
        backgroundColor: "rgb(22, 163, 74)",
    },
    cancelButton: {
        backgroundColor: "#ef4444",
    },
    disabledButton: {
        backgroundColor: "#86efac",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ThresholdSettingsPage;
