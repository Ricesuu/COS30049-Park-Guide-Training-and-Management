// components/PGdashboard/Module/ModuleCard.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ModuleCard = ({ module, onPress }) => {
    const isPendingPayment = module.paymentStatus === "pending";

    return (
        <TouchableOpacity
            style={styles.moduleCard}
            onPress={isPendingPayment ? null : () => onPress(module)}
            disabled={isPendingPayment}
        >
            {isPendingPayment && (
                <View style={styles.paymentStatusBadge}>
                    <Text style={styles.paymentStatusText}>
                        Payment Pending
                    </Text>
                </View>
            )}
            <View
                style={[
                    styles.moduleInfo,
                    isPendingPayment && styles.moduleInfoWithBadge,
                ]}
            >
                <Text style={styles.moduleTitle}>
                    {module.name || module.title || "Unnamed Module"}
                </Text>
                <Text style={styles.moduleDescription} numberOfLines={2}>
                    {module.description || "No description available"}
                </Text>
                {module.is_completed && (
                    <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>Completed</Text>
                        <AntDesign
                            name="checkcircleo"
                            size={16}
                            color="#16a34a"
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    moduleCard: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginHorizontal: 2,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: "relative",
    },
    moduleInfo: {
        padding: 16,
    },
    moduleInfoWithBadge: {
        opacity: 0.5,
    },
    moduleTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    moduleDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
    },
    completedBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dcfce7",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    completedText: {
        color: "#16a34a",
        fontSize: 14,
        fontWeight: "500",
        marginRight: 4,
    },
    paymentStatusBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#FFF3CD",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 1,
    },
    paymentStatusText: {
        color: "#856404",
        fontSize: 12,
        fontWeight: "500",
    },
});

export default ModuleCard;
