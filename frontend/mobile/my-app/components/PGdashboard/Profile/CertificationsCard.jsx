// components/PGdashboard/Profile/CertificationsCard.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CertificationsCard = ({ certifications }) => {
    if (certifications.length === 0) return null;

    return (
        <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>My Certifications</Text>
            {certifications.map((cert, index) => (
                <View key={index} style={styles.certItem}>
                    <MaterialIcons
                        name="verified"
                        size={24}
                        color="rgb(22, 163, 74)"
                    />
                    <View style={styles.certDetails}>
                        <Text style={styles.certName}>
                            {cert.name || cert.module_name}
                        </Text>
                        <Text style={styles.certDate}>
                            Issued:{" "}
                            {new Date(
                                cert.issued_date || cert.issue_date
                            ).toLocaleDateString()}
                        </Text>
                        {cert.expiry_date && (
                            <Text style={styles.certDate}>
                                Expires:{" "}
                                {new Date(
                                    cert.expiry_date
                                ).toLocaleDateString()}
                            </Text>
                        )}
                    </View>
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
    certItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    certDetails: {
        marginLeft: 10,
        flex: 1,
    },
    certName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    certDate: {
        fontSize: 13,
        color: "#666",
    },
});

export default CertificationsCard;
