// components/PGdashboard/Profile/PaymentHistoryCard.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PaymentHistoryCard = ({ paymentHistory }) => {
    const router = useRouter();

    if (paymentHistory.length === 0) return null;

    return (
        <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            {paymentHistory.slice(0, 5).map((payment, index) => (
                <View key={index} style={styles.paymentItem}>
                    <View style={styles.paymentHeader}>
                        <Text style={styles.paymentPurpose}>
                            {payment.paymentPurpose}
                        </Text>
                        <Text
                            style={[
                                styles.paymentStatus,
                                payment.paymentStatus === "approved"
                                    ? styles.textSuccess
                                    : payment.paymentStatus === "pending"
                                    ? styles.textWarning
                                    : styles.textDanger,
                            ]}
                        >
                            {payment.paymentStatus.toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.paymentDetails}>
                        <Text style={styles.paymentMethod}>
                            <Ionicons
                                name={
                                    payment.paymentMethod === "credit"
                                        ? "card"
                                        : payment.paymentMethod === "debit"
                                        ? "card-outline"
                                        : "wallet"
                                }
                                size={14}
                                color="#666"
                            />{" "}
                            {payment.paymentMethod === "e_wallet"
                                ? "E-Wallet"
                                : payment.paymentMethod
                                      .charAt(0)
                                      .toUpperCase() +
                                  payment.paymentMethod.slice(1)}
                        </Text>
                        <Text style={styles.paymentAmount}>
                            RM{parseFloat(payment.amountPaid).toFixed(2)}
                        </Text>
                    </View>
                    <Text style={styles.paymentDate}>
                        {new Date(
                            payment.transaction_date
                        ).toLocaleDateString()}
                    </Text>
                </View>
            ))}
            {paymentHistory.length > 5 && (
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => router.push("/pg-dashboard/payment")}
                >
                    <Text style={styles.viewAllText}>View All Payments</Text>
                </TouchableOpacity>
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
    paymentItem: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    paymentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    paymentPurpose: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        flex: 1,
    },
    paymentStatus: {
        fontSize: 12,
        fontWeight: "bold",
    },
    textSuccess: {
        color: "rgb(22, 163, 74)",
    },
    textWarning: {
        color: "#f59e0b",
    },
    textDanger: {
        color: "#ef4444",
    },
    paymentDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    paymentMethod: {
        fontSize: 13,
        color: "#666",
    },
    paymentAmount: {
        fontSize: 14,
        fontWeight: "700",
        color: "#333",
    },
    paymentDate: {
        fontSize: 12,
        color: "#888",
        marginTop: 3,
    },
    viewAllButton: {
        alignItems: "center",
        padding: 10,
        marginTop: 5,
    },
    viewAllText: {
        color: "rgb(22, 163, 74)",
        fontWeight: "600",
    },
});

export default PaymentHistoryCard;
