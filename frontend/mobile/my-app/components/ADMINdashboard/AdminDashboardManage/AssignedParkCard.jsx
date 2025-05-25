// components/ADMINdashboard/AdminDashboardManage/AssignedParkCard.jsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../../src/constants/constants";

const AssignedParkCard = ({ guide }) => {
    const [parkName, setParkName] = useState("");

    useEffect(() => {
        const fetchParkDetails = async () => {
            if (guide?.park) {
                try {
                    const response = await fetch(
                        `${API_URL}/api/parks/${guide.park}`
                    );
                    if (response.ok) {
                        const parkData = await response.json();
                        setParkName(parkData.park_name);
                    }
                } catch (error) {
                    console.error("Error fetching park details:", error);
                }
            }
        };

        fetchParkDetails();
    }, [guide?.park]);
    return !guide || !guide.park ? (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Assigned Park</Text>
            <View style={styles.emptyState}>
                <Ionicons
                    name="alert-circle-outline"
                    size={24}
                    color="#9CA3AF"
                />
                <Text style={styles.emptyText}>
                    {!guide ? "No guide data available" : "No park assigned"}
                </Text>
            </View>
        </View>
    ) : (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Assigned Park</Text>
            {parkName ? (
                <View style={styles.parkInfo}>
                    <Ionicons name="leaf" size={24} color="rgb(22, 163, 74)" />
                    <Text style={styles.parkName}>{parkName}</Text>
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={24}
                        color="#9CA3AF"
                    />
                    <Text style={styles.emptyText}>No park assigned</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#111827",
    },
    parkInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    parkName: {
        marginLeft: 10,
        fontSize: 16,
        color: "#374151",
        fontWeight: "500",
    },
    emptyState: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        padding: 12,
        borderRadius: 6,
    },
    emptyText: {
        marginLeft: 8,
        fontSize: 15,
        color: "#6B7280",
        fontStyle: "italic",
    },
});

export default AssignedParkCard;
