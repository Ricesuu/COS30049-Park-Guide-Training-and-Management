// components/PGdashboard/Module/ModuleCard.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

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
                <View style={styles.moduleProgressContainer}>
                    <Progress.Bar
                        progress={(module.progress || 0) / 100}
                        width={null}
                        color="#16a34a"
                        unfilledColor="#E0E0E0"
                        borderWidth={0}
                        height={8}
                    />
                    <Text style={styles.moduleProgressText}>
                        {module.progress !== undefined
                            ? `${module.progress}%`
                            : "0%"}
                    </Text>
                </View>
                {module.is_completed && (
                    <View style={styles.completedBadge}>
                        <AntDesign
                            name="checkcircle"
                            size={16}
                            color="#16a34a"
                        />
                        <Text style={styles.completedText}>Completed</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    moduleCard: {
        backgroundColor: "#F5F5F4",
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
        position: "relative",
    },
    moduleInfo: {
        padding: 15,
    },
    moduleInfoWithBadge: {
        paddingTop: 40, // Make room for the badge
    },
    moduleTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    moduleDescription: {
        fontSize: 14,
        color: "#757575",
        marginBottom: 10,
    },
    moduleProgressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5,
    },
    moduleProgressText: {
        fontSize: 12,
        color: "#16a34a",
        fontWeight: "bold",
        marginLeft: 5,
    },
    completedBadge: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    completedText: {
        marginLeft: 5,
        color: "#16a34a",
        fontWeight: "500",
    },
    paymentStatusBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 8,
        paddingVertical: 4,
        zIndex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: "center",
    },
    paymentStatusText: {
        color: "#D97706",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default ModuleCard;
