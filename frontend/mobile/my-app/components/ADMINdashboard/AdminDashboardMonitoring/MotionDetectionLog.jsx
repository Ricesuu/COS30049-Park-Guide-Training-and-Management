import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const MotionDetectionLog = ({ data }) => {
    // Filter to only include "detected" events
    const detectionEvents = data.labels
        .map((label, index) => ({
            id: index.toString(),
            time: label,
            value: data.values[index],
        }))
        .filter((event) => event.value === 1);

    // Show a message if no motion was detected
    if (detectionEvents.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons
                    name="motion-photos-off"
                    size={50}
                    color="#ccc"
                />
                <Text style={styles.emptyText}>No motion detected today</Text>
            </View>
        );
    }

    // Render individual time entries
    const renderItem = ({ item }) => (
        <View style={styles.eventItem}>
            <View style={styles.timeContainer}>
                <MaterialIcons name="access-time" size={22} color="#555" />
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={styles.eventIndicator}>
                <MaterialIcons
                    name="motion-photos-on"
                    size={24}
                    color="#ff8c00"
                />
                <Text style={styles.detectionText}>Motion Detected</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Motion Detection Events Today</Text>
            <Text style={styles.subtitle}>
                {detectionEvents.length} events detected
            </Text>

            <FlatList
                data={detectionEvents}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
    },
    list: {
        maxHeight: 400,
    },
    eventItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: {
        fontSize: 16,
        marginLeft: 8,
        color: "#333",
    },
    eventIndicator: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff9f0",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    detectionText: {
        marginLeft: 6,
        color: "#ff8c00",
        fontWeight: "500",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 200,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        marginTop: 10,
    },
});

export default MotionDetectionLog;
