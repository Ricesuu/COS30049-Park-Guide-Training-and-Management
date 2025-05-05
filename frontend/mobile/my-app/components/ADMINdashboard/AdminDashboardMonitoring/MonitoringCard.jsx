import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";

const MonitoringCard = ({ type, value, onPress, style, valueStyle }) => {
    const cardWidth = (Dimensions.get("window").width - 30) / 2;

    // Determine if the value is a "No readings today" message
    const isNoReadings = value === "No readings today";

    // Determine status indicator color based on type and value
    const getStatusColor = () => {
        // Skip status indicator for "No readings today"
        if (isNoReadings) return null;

        // Parse the numeric value if possible
        let numericValue;
        if (typeof value === "string") {
            const match = value.match(/[\d.]+/);
            numericValue = match ? parseFloat(match[0]) : null;
        }

        const typeLower = type.toLowerCase();

        if (typeLower === "temperature") {
            if (numericValue > 30) return "#ff0000"; // Red for high temp
            if (numericValue < 15) return "#0000ff"; // Blue for low temp
            return "#00cc00"; // Green for normal temp
        }

        if (typeLower === "humidity") {
            if (numericValue > 80) return "#ff6600"; // Orange for high humidity
            if (numericValue < 40) return "#ff9900"; // Yellow-orange for low humidity
            return "#00cc00"; // Green for normal humidity
        }

        if (typeLower.includes("soil moisture")) {
            if (numericValue < 30) return "#ff0000"; // Red for dry soil
            if (numericValue > 70) return "#0000ff"; // Blue for wet soil
            return "#00cc00"; // Green for normal soil moisture
        }

        if (typeLower.includes("motion")) {
            // Green if no motion events, yellow if some
            return parseInt(value) === 0 ? "#00cc00" : "#ff9900";
        }

        return "#cccccc"; // Default gray
    };

    const statusColor = getStatusColor();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.card, { width: cardWidth }, style]}
        >
            {statusColor && (
                <View
                    style={[
                        styles.statusIndicator,
                        { backgroundColor: statusColor },
                    ]}
                />
            )}

            <Text
                style={[
                    styles.value,
                    isNoReadings ? styles.smallValue : {},
                    valueStyle,
                ]}
            >
                {value}
            </Text>
            <Text style={styles.type}>{type}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 16,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center", // Add this to center content vertically
        position: "relative", // For absolute positioning of status indicator
        height: 170, // Set a fixed height to ensure consistency
    },
    value: {
        fontSize: 30,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
        marginBottom: 8,
        textAlign: "center",
    },
    smallValue: {
        fontSize: 16,
        fontWeight: "normal",
    },
    type: {
        fontSize: 16,
        color: "#666",
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: "absolute",
        top: 10,
        right: 10,
    },
});

export default MonitoringCard;
