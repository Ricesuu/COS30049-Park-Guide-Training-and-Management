// components/PGdashboard/Profile/TrainingProgressCard.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TrainingProgressCard = ({ trainingProgress }) => {
    if (trainingProgress.length === 0) return null;

    return (
        <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Training Progress</Text>
            {trainingProgress.map((item, index) => (
                <View key={index} style={styles.progressItem}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>
                            {item.module_name}
                        </Text>
                        <View
                            style={[
                                styles.statusBadge,
                                item.status === "Completed"
                                    ? styles.completedBadge
                                    : item.status === "in progress"
                                    ? styles.inProgressBadge
                                    : styles.notStartedBadge,
                            ]}
                        >
                            <Text style={styles.statusText}>
                                {item.status === "Completed"
                                    ? "COMPLETED"
                                    : item.status === "in progress"
                                    ? "IN PROGRESS"
                                    : "NOT STARTED"}
                            </Text>
                        </View>
                    </View>
                    {item.status === "Completed" && item.completion_date && (
                        <Text style={styles.progressDetail}>
                            Completed on:{" "}
                            {new Date(
                                item.completion_date
                            ).toLocaleDateString()}
                        </Text>
                    )}
                    {item.status === "in progress" && (
                        <Text style={styles.progressDetail}>
                            Progress: {item.progress || "In progress"}
                        </Text>
                    )}
                </View>
            ))}
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
    progressItem: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    progressTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        flex: 1,
    },
    statusBadge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    completedBadge: {
        backgroundColor: "#d1fae5",
    },
    inProgressBadge: {
        backgroundColor: "#fef3c7",
    },
    notStartedBadge: {
        backgroundColor: "#f3f4f6",
    },
    statusText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#333",
    },
    progressDetail: {
        fontSize: 13,
        color: "#666",
        marginTop: 3,
    },
});

export default TrainingProgressCard;
