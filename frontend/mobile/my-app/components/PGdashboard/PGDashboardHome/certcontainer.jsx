import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { formatDate } from "../../../utils/formatHelpers";

const CertContainer = ({ certifications }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Certifications & Licenses</Text>
            {certifications && certifications.length > 0 ? (
                certifications.map((cert, index) => (
                    <View key={index} style={styles.certItem}>
                        <Image source={cert.image} style={styles.certImage} />{" "}
                        <View style={styles.certDetails}>
                            <Text style={styles.certName}>
                                {cert.name || "Unknown Certification"}
                            </Text>
                            <Text style={styles.certExpiry}>
                                Expiry:{" "}
                                {formatDate(cert.expiryDate, "No expiry date")}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.noCertsContainer}>
                    <Text style={styles.noCertsText}>
                        No certifications available
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center", // Center content
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginVertical: 10,
        width: "100%", // Match the width of ProfileView
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#333",
    },
    certItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        width: "100%",
    },
    certImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    certDetails: {
        flex: 1,
    },
    certName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
    },
    certExpiry: {
        fontSize: 14,
        color: "#888",
    },
    noCertsContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        width: "100%",
        marginVertical: 10,
    },
    noCertsText: {
        fontSize: 16,
        color: "#888",
        fontStyle: "italic",
    },
});

export default CertContainer;
