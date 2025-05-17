// components/PGdashboard/Profile/AssignedParkCard.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const AssignedParkCard = ({ assignedPark }) => {
    if (!assignedPark) return null;

    return (
        <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Assigned Park</Text>
            <View style={styles.parkHeader}>
                <FontAwesome5 name="tree" size={24} color="rgb(22, 163, 74)" />
                <Text style={styles.parkName}>{assignedPark.park_name}</Text>
            </View>
            <Text style={styles.parkLocation}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#666" />{" "}
                {assignedPark.location}
            </Text>
            <Text style={styles.parkDescription}>
                {assignedPark.description}
            </Text>
            {assignedPark.wildlife && (
                <View style={styles.wildlifeContainer}>
                    <Text style={styles.wildlifeTitle}>
                        <FontAwesome5 name="paw" size={14} color="#666" />{" "}
                        Notable Wildlife:
                    </Text>
                    <Text style={styles.parkDescription}>
                        {assignedPark.wildlife}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    detailsCard: {
        backgroundColor: "#f9fafb",
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    parkHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    parkName: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
        color: "#333",
    },
    parkLocation: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    parkDescription: {
        fontSize: 14,
        color: "#444",
        lineHeight: 20,
    },
    wildlifeContainer: {
        marginTop: 10,
    },
    wildlifeTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
        marginBottom: 4,
    },
});

export default AssignedParkCard;
