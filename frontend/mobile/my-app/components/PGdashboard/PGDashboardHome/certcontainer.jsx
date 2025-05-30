import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatDate } from "../../../utils/formatHelpers";

const CertContainer = ({ certifications }) => {
    console.log("CertContainer received certifications:", certifications);

    const getCertificationStatus = (cert) => {
        if (!cert.expiry_date) return "ongoing";
        const expiryDate = new Date(cert.expiry_date);
        const now = new Date();

        if (expiryDate < now) return "expired";

        // Check if expiring in next 30 days
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        if (expiryDate <= thirtyDaysFromNow) return "expiring";

        return "active";
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "active":
                return { color: "rgb(22, 163, 74)" }; // Green
            case "expiring":
                return { color: "#f59e0b" }; // Amber
            case "expired":
                return { color: "#dc2626" }; // Red
            case "ongoing":
                return { color: "#3b82f6" }; // Blue
            default:
                return { color: "#666" };
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Certifications & Licenses</Text>{" "}
            {certifications && certifications.length > 0 ? (
                certifications
                    .filter((cert) => cert.status === "completed")
                    .map((cert, index) => {
                        const status = getCertificationStatus(cert);
                        const statusStyle = getStatusStyles(status);

                        return (
                            <View
                                key={index}
                                style={[
                                    styles.certItem,
                                    status === "expired" &&
                                        styles.certItemExpired,
                                ]}
                            >
                                {" "}
                                <View style={styles.certDetails}>
                                    <Text style={styles.certName}>
                                        {cert.module_name ||
                                            cert.name ||
                                            "Unknown Certification"}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
            ) : (
                <View style={styles.noCertsContainer}>
                    <Text style={styles.noCertsText}>
                        Complete training modules to earn certifications
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginVertical: 10,
        width: "100%",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "rgb(22, 163, 74)",
    },
    certItem: {
        flexDirection: "row",
        marginBottom: 15,
        padding: 12,
        backgroundColor: "#f9fafb",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    certItemExpired: {
        borderColor: "#dc2626",
        backgroundColor: "#fee2e2",
    },
    certDetails: {
        flex: 1,
    },
    certName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    certStatus: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 4,
    },
    certDate: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
    },
    certExpiry: {
        fontSize: 14,
        color: "#666",
    },
    noCertsContainer: {
        padding: 15,
        alignItems: "center",
        backgroundColor: "#f9fafb",
        borderRadius: 8,
    },
    noCertsText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
});

export default CertContainer;
