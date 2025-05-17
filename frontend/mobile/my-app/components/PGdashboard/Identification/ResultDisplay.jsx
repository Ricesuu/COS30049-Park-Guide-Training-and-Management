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
                <Text style={styles.value}>{name}</Text>
            </View>

            <View style={styles.resultSection}>
                <Text style={styles.label}>Scientific Name:</Text>
                <Text style={styles.valueItalic}>{scientificName}</Text>
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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "rgb(22, 163, 74)",
    },
    resultSection: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        color: "#111827",
    },
    valueItalic: {
        fontSize: 16,
        color: "#111827",
        fontStyle: "italic",
    },
    confidenceContainer: {
        height: 20,
        backgroundColor: "#f3f4f6",
        borderRadius: 10,
        overflow: "hidden",
        position: "relative",
        marginTop: 5,
    },
    confidenceBar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        borderRadius: 10,
    },
    highConfidence: {
        backgroundColor: "rgb(22, 163, 74)",
    },
    mediumConfidence: {
        backgroundColor: "#f59e0b",
    },
    lowConfidence: {
        backgroundColor: "#ef4444",
    },
    confidenceText: {
        position: "absolute",
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
        left: 8,
        top: 2,
    },
    description: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
    },
});

export default ResultDisplay;
