// components/PGdashboard/Profile/AssignedParkCard.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const AssignedParkCard = ({ assignedPark }) => {
    return (
        <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Assigned Park</Text>
            <View style={styles.parkHeader}>
                <FontAwesome5 name="tree" size={24} color="rgb(22, 163, 74)" />
                <Text style={styles.parkName}>
                    {assignedPark?.park_name || "No park assigned"}
                </Text>
            </View>
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
    },
    parkName: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
        color: "#333",
    },
});

export default AssignedParkCard;
