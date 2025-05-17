// components/ADMINdashboard/AdminDashboardManage/CertificationsCard.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CertificationsCard = ({ certifications = [] }) => {
    // Safely handle rendering date
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString();
        } catch (e) {
            return "Invalid date";
        }
    };

    // Handle undefined or null certifications
    const validCertifications = Array.isArray(certifications)
        ? certifications
        : [];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Certifications</Text>

            {validCertifications.length > 0 ? (
                validCertifications.map((cert, index) => (
                    <View key={index} style={styles.certItem}>
                        <Ionicons
                            name="ribbon"
                            size={24}
                            color="rgb(22, 163, 74)"
                        />
                        <View style={styles.certDetails}>
                            <Text style={styles.certName}>
                                {cert?.name ||
                                    cert?.module_name ||
                                    "Certification"}
                            </Text>
                            <Text style={styles.certDate}>
                                Issued:{" "}
                                {formatDate(
                                    cert?.issued_date || cert?.issue_date
                                )}
                            </Text>
                            {cert?.expiry_date && (
                                <Text style={styles.certDate}>
                                    Expires: {formatDate(cert.expiry_date)}
                                </Text>
                            )}
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={24}
                        color="#9CA3AF"
                    />
                    <Text style={styles.emptyText}>
                        No certifications found
                    </Text>
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
    certItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    certDetails: {
        marginLeft: 10,
        flex: 1,
    },
    certName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#374151",
        marginBottom: 4,
    },
    certDate: {
        fontSize: 14,
        color: "#6B7280",
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

export default CertificationsCard;
