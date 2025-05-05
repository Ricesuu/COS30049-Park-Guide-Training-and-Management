import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const AlertCard = ({
    title,
    description,
    severity = "medium",
    onRemove,
    style,
}) => {
    // Determine colors based on severity
    const getSeverityColors = () => {
        switch (severity.toLowerCase()) {
            case "high":
                return {
                    background: "#FFEBEB",
                    border: "#FF8080",
                    text: "#CC0000",
                    icon: "#FF0000",
                };
            case "medium":
                return {
                    background: "#FFF8E6",
                    border: "#FFCB65",
                    text: "#CC7A00",
                    icon: "#FF9800",
                };
            case "low":
                return {
                    background: "#E6F4FF",
                    border: "#80C2FF",
                    text: "#0066CC",
                    icon: "#0088FF",
                };
            default:
                return {
                    background: "#F0F0F0",
                    border: "#CCCCCC",
                    text: "#666666",
                    icon: "#999999",
                };
        }
    };

    const severityColors = getSeverityColors();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: severityColors.background,
                    borderColor: severityColors.border,
                },
                style,
            ]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: severityColors.text }]}>
                    {title}
                </Text>
                <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
                    <MaterialIcons
                        name="close"
                        size={24}
                        color={severityColors.icon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={[styles.description, { color: severityColors.text }]}>
                {description}
            </Text>

            {/* Severity indicator */}
            <View style={styles.severityContainer}>
                <View
                    style={[
                        styles.severityIndicator,
                        { backgroundColor: severityColors.icon },
                    ]}
                />
                <Text
                    style={[
                        styles.severityText,
                        { color: severityColors.text },
                    ]}
                >
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}{" "}
                    Priority
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        marginVertical: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
    },
    closeButton: {
        padding: 5,
    },
    description: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 20,
    },
    severityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    severityIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 5,
    },
    severityText: {
        fontSize: 12,
        fontStyle: "italic",
    },
});

export default AlertCard;
