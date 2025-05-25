import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TrainingProgressContainer = ({ trainingProgress }) => {
    const getProgressColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "rgb(34 197 94)"; // green-500
            case "in progress":
                return "rgb(234 179 8)"; // yellow-500
            default:
                return "rgb(239 68 68)"; // red-500
        }
    }; // Sort modules: in-progress first, then completed    // Filter out modules with pending payments
    const validModules = (trainingProgress || []).filter((module) => {
        // Include modules if:
        // 1. They are free (no purchase_status and payment_status)
        // 2. They have an approved payment
        return (
            !module.purchase_status || // Free modules
            (module.purchase_status === "active" &&
                module.payment_status === "approved")
        ); // Paid modules
    });

    // Sort the filtered modules
    const sortedModules = [...validModules].sort((a, b) => {
        if (a.status === b.status) return 0;
        if (a.status.toLowerCase() === "in progress") return -1;
        if (b.status.toLowerCase() === "in progress") return 1;
        return 0;
    });

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Training Progress</Text>

            {!sortedModules || sortedModules.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="book-outline" size={24} color="#9CA3AF" />
                    <Text style={styles.emptyText}>
                        No training modules yet
                    </Text>
                </View>
            ) : (
                <View style={styles.modulesList}>
                    {sortedModules.slice(0, 3).map((module, index) => (
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
                    {sortedModules.length > 3 && (
                        <Text style={styles.moreModulesText}>
                            and {sortedModules.length - 3} more{" "}
                            {sortedModules.length - 3 === 1
                                ? "module"
                                : "modules"}
                        </Text>
                    )}
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
    moreModulesText: {
        color: "#6B7280",
        fontSize: 14,
        textAlign: "center",
        marginTop: 8,
        fontStyle: "italic",
    },
});

export default TrainingProgressContainer;
