// AlertTestingTool.jsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchData } from "../../src/api/api";

const AlertTestingTool = ({ onSubmitSuccess }) => {
    const [parkId, setParkId] = useState("1");
    const [sensorType, setSensorType] = useState("temperature");
    const [sensorValue, setSensorValue] = useState("40");
    const [loading, setLoading] = useState(false);

    const getDefaultValue = (type) => {
        switch (type) {
            case "temperature":
                return "40";
            case "humidity":
                return "45";
            case "soil moisture":
                return "25";
            case "motion":
                return "1";
            default:
                return "40";
        }
    };

    const handleSensorTypeChange = (itemValue) => {
        setSensorType(itemValue);
        setSensorValue(getDefaultValue(itemValue));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const recordedValue =
                sensorType === "motion"
                    ? sensorValue === "1"
                        ? "detected"
                        : "not detected"
                    : `${sensorValue}${
                          sensorType === "temperature" ? "°C" : "%"
                      }`;

            // Add detailed logging before sending the request
            console.log("==== ALERT TESTING TOOL - SUBMIT START ====");
            console.log("Submitting test data with values:", {
                park_id: parseInt(parkId),
                sensor_type: sensorType,
                recorded_value: recordedValue,
            });

            const response = await fetchData("/iot-monitoring", {
                method: "POST",
                body: JSON.stringify({
                    park_id: parseInt(parkId),
                    sensor_type: sensorType,
                    recorded_value: recordedValue,
                }),
            });

            // Log successful response
            console.log("Alert test data submission response:", response);
            console.log("==== ALERT TESTING TOOL - SUBMIT COMPLETE ====");

            Alert.alert("Success", "Test data submitted successfully!", [
                {
                    text: "OK",
                    onPress: () => {
                        if (
                            onSubmitSuccess &&
                            typeof onSubmitSuccess === "function"
                        ) {
                            console.log("Calling refresh callback function");
                            onSubmitSuccess();
                        }
                    },
                },
            ]);
        } catch (err) {
            // Enhanced error logging
            console.error("==== ALERT TESTING TOOL - SUBMIT ERROR ====");
            console.error("Error submitting test data:", err);
            console.error("Error details:", {
                message: err.message,
                stack: err.stack,
            });
            console.error("==== END ERROR LOG ====");

            Alert.alert(
                "Error",
                "Failed to submit test data. Please check console for details."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Alert Testing Tool</Text>

            <Text style={styles.label}>Park:</Text>
            <Picker
                selectedValue={parkId}
                onValueChange={(itemValue) => setParkId(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Bako National Park" value="1" />
                <Picker.Item label="Semenggoh Wildlife Centre" value="2" />
            </Picker>

            <Text style={styles.label}>Sensor Type:</Text>
            <Picker
                selectedValue={sensorType}
                onValueChange={handleSensorTypeChange}
                style={styles.picker}
            >
                <Picker.Item label="Temperature" value="temperature" />
                <Picker.Item label="Humidity" value="humidity" />
                <Picker.Item label="Soil Moisture" value="soil moisture" />
                <Picker.Item label="Motion" value="motion" />
            </Picker>

            <Text style={styles.label}>Value:</Text>
            <TextInput
                style={styles.input}
                value={sensorValue}
                onChangeText={setSensorValue}
                keyboardType={
                    sensorType === "motion" ? "numeric" : "decimal-pad"
                }
                placeholder={
                    sensorType === "motion"
                        ? "1 (detected) or 0 (not detected)"
                        : "Enter value"
                }
            />

            <Text style={styles.preview}>
                Will submit:{" "}
                <Text style={styles.previewValue}>
                    {sensorType === "motion"
                        ? sensorValue === "1"
                            ? "detected"
                            : "not detected"
                        : `${sensorValue}${
                              sensorType === "temperature" ? "°C" : "%"
                          }`}
                </Text>{" "}
                (This value should trigger an alert)
            </Text>

            <Button
                title={loading ? "Submitting..." : "Submit Test Value"}
                onPress={handleSubmit}
                disabled={loading}
                color="rgb(22, 163, 74)"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f9fafb",
        borderRadius: 8,
        margin: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "rgb(22, 163, 74)",
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: "500",
    },
    picker: {
        backgroundColor: "#f0f0f0",
        marginBottom: 15,
        borderRadius: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 8,
        marginBottom: 15,
    },
    preview: {
        fontStyle: "italic",
        marginBottom: 15,
        color: "#666",
    },
    previewValue: {
        fontWeight: "bold",
        color: "#E53935",
    },
});

export default AlertTestingTool;
