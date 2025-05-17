// components/PGdashboard/Identification/ResultDisplay.jsx
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const ResultDisplay = ({ loading, identificationResult }) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(22, 163, 74)" />
                <Text style={styles.loadingText}>Identifying orchid...</Text>
            </View>
        );
    }

    if (!identificationResult) {
        return null;
    }

    const { name, scientificName, confidence, description, careInstructions } =
        identificationResult;
    const confidencePercentage = Math.round(confidence * 100);

    return (
        <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Identification Result</Text>

            <View style={styles.resultSection}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{name || "Unknown"}</Text>
            </View>

            <View style={styles.resultSection}>
                <Text style={styles.label}>Scientific Name:</Text>
                <Text style={styles.valueItalic}>
                    {scientificName || "Not available"}
                </Text>
            </View>

            <View style={styles.resultSection}>
                <Text style={styles.label}>Confidence:</Text>
                <View style={styles.confidenceContainer}>
                    <View
                        style={[
                            styles.confidenceBar,
                            { width: `${confidencePercentage}%` },
                            confidencePercentage > 80
                                ? styles.highConfidence
                                : confidencePercentage > 50
                                ? styles.mediumConfidence
                                : styles.lowConfidence,
                        ]}
                    />
                    <Text style={styles.confidenceText}>
                        {confidencePercentage}%
                    </Text>
                </View>
            </View>

            {description && (
                <View style={styles.resultSection}>
                    <Text style={styles.label}>Description:</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
            )}

            {careInstructions && (
                <View style={styles.resultSection}>
                    <Text style={styles.label}>Care Instructions:</Text>
                    <Text style={styles.description}>{careInstructions}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "rgb(22, 163, 74)",
    },
    resultContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
        marginBottom: 15,
        textAlign: "center",
    },
    resultSection: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 3,
    },
    value: {
        fontSize: 16,
        color: "#444",
    },
    valueItalic: {
        fontSize: 16,
        color: "#444",
        fontStyle: "italic",
    },
    description: {
        fontSize: 15,
        color: "#444",
        lineHeight: 20,
    },
    confidenceContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 20,
        marginTop: 5,
    },
    confidenceBar: {
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    highConfidence: {
        backgroundColor: "#22c55e", // Green
    },
    mediumConfidence: {
        backgroundColor: "#f59e0b", // Yellow/Orange
    },
    lowConfidence: {
        backgroundColor: "#ef4444", // Red
    },
    confidenceText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
});

export default ResultDisplay;
