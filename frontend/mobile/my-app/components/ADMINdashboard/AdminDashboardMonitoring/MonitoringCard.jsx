import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";

const MonitoringCard = ({
    type,
    value,
    onPress,
    style,
    valueStyle,
    threshold = null,
}) => {
    const cardWidth = (Dimensions.get("window").width - 40) / 2; // Adjusted for 2x2 grid

    // Determine if the value should be N/A or if it's a zero motion reading
    const displayValue = value === "No readings today" ? "N/A" : value;
    const isNA = value === "No readings today";
    const isZeroMotion =
        type.toLowerCase().includes("motion") &&
        (value.startsWith("0") || value.includes("0 motion"));

    // Determine if we should grey out the text (either N/A or zero motion)
    const shouldGreyOut = isNA || isZeroMotion;

    // Determine status indicator color based on type and value
    const getStatusColor = () => {
        if (isNA || isZeroMotion) return null;

        // Parse the numeric value if possible
        let numericValue;
        if (typeof value === "string") {
            // Handle percentage values (like "75%") and regular numbers
            const match = value.match(/[\d.]+/);
            numericValue = match ? parseFloat(match[0]) : null;
        }

        const typeLower = type.toLowerCase();

        // Return null for motion detection to never show status indicator
        if (typeLower.includes("motion")) {
            return null;
        }

        // If we have thresholds from the database, use those instead of hardcoded values
        if (threshold) {
            if (!isNaN(numericValue)) {
                // For both temperature and humidity
                if (
                    threshold.min_threshold !== null &&
                    numericValue < threshold.min_threshold
                ) {
                    return "#ff0000"; // Red for out of range
                }
                if (
                    threshold.max_threshold !== null &&
                    numericValue > threshold.max_threshold
                ) {
                    return "#ff0000"; // Red for out of range
                }
                // Add warning state for values close to thresholds (within 10%)
                const range = threshold.max_threshold - threshold.min_threshold;
                const warningMargin = range * 0.1;
                if (
                    numericValue <= threshold.min_threshold + warningMargin ||
                    numericValue >= threshold.max_threshold - warningMargin
                ) {
                    return "#ff9900"; // Orange for warning
                }
                return "#00cc00"; // Green for normal range
            }
        }

        return "#00cc00"; // Default to green if no threshold rules match
    };

    const statusColor = getStatusColor();
    const statusIndicator = statusColor ? (
        <View
            style={[styles.statusIndicator, { backgroundColor: statusColor }]}
        />
    ) : null;

    return (
        <TouchableOpacity
            style={[styles.card, { width: cardWidth }, style]}
            onPress={onPress}
        >
            {statusIndicator}
            <View style={styles.contentContainer}>
                <Text style={styles.type}>{type}</Text>
                <View style={styles.valueContainer}>
                    <Text
                        style={[
                            styles.value,
                            shouldGreyOut && styles.naValue,
                            valueStyle,
                        ]}
                    >
                        {displayValue}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: "relative", // For absolute positioning of status indicator
        height: 120, // Fixed height for all cards
        justifyContent: "center", // Center content vertically
    },
    contentContainer: {
        alignItems: "center", // Center all content
        justifyContent: "center",
        width: "100%",
    },
    type: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
        textAlign: "center",
    },
    valueContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    value: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    naValue: {
        color: "#666",
        opacity: 0.8,
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    },
});

export default MonitoringCard;
