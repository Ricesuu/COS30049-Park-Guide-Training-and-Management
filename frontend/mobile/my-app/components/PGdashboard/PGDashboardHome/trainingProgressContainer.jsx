import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TrainingProgressContainer = ({ trainingProgress }) => {
    const getProgressColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "rgb(34 197 94)"; // green-500
            case "in_progress":
                return "rgb(234 179 8)"; // yellow-500
            default:
                return "rgb(239 68 68)"; // red-500
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Training Progress</Text>

            {!trainingProgress || trainingProgress.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="book-outline" size={24} color="#9CA3AF" />
                    <Text style={styles.emptyText}>
                        No training modules yet
                    </Text>
                </View>
            ) : (
                <View style={styles.modulesList}>
                    {trainingProgress.map((module, index) => (
                        <View key={index} style={styles.moduleCard}>
                            <View style={styles.moduleHeader}>
                                <Text style={styles.moduleName}>
                                    {module.module_name}
                                </Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor: getProgressColor(
                                                module.status
                                            ),
                                        },
                                    ]}
                                >
                                    <Text style={styles.statusText}>
                                        {module.status}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.moduleDetails}>
                                {module.start_date && (
                                    <Text style={styles.moduleDate}>
                                        Started:{" "}
                                        {new Date(
                                            module.start_date
                                        ).toLocaleDateString()}
                                    </Text>
                                )}
                                {module.completion_date && (
                                    <Text style={styles.moduleDate}>
                                        Completed:{" "}
                                        {new Date(
                                            module.completion_date
                                        ).toLocaleDateString()}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))}
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
    modulesList: {
        gap: 12,
    },
    moduleCard: {
        backgroundColor: "#F9FAFB",
        borderRadius: 6,
        padding: 12,
        marginBottom: 8,
    },
    moduleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    moduleName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#374151",
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: "white",
        fontSize: 12,
        fontWeight: "500",
        textTransform: "capitalize",
    },
    moduleDetails: {
        gap: 4,
    },
    moduleDate: {
        fontSize: 14,
        color: "#6B7280",
    },
    emptyState: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
        gap: 8,
    },
    emptyText: {
        color: "#9CA3AF",
        fontSize: 16,
    },
});

export default TrainingProgressContainer;
