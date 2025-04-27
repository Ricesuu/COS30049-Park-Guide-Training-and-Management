import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const CertContainer = ({ certifications }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Certifications & Licenses</Text>
      {certifications.map((cert, index) => (
        <View key={index} style={styles.certItem}>
          {/* Certification Image */}
          <Image source={cert.image} style={styles.certImage} />
          <View style={styles.certDetails}>
            <Text style={styles.certName}>{cert.name}</Text>
            <Text style={styles.certExpiry}>Expiry: {cert.expiryDate}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
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
});

export default CertContainer;