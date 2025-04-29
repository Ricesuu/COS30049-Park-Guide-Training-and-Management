import React from "react";
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/PGDashboardHome/Header";

const Certificate = () => {
  const navigation = useNavigation();

  const certifications = [
    {
      name: "First Aid Certification",
      expiryDate: "2025-12-31",
      image: require("../../assets/images/firstaid.jpg"),
      obtained: true,
    },
    {
      name: "Semenggoh Wildlife Centre Certification",
      expiryDate: "2026-06-30",
      image: require("../../assets/images/Semenggoh.jpeg"),
      obtained: true,
    },
    {
      name: "Wildlife Safety Certification",
      expiryDate: null,
      image: require("../../assets/images/wildlife_safety.jpg"),
      obtained: false,
    },
    {
      name: "Advanced Park Guide Certification",
      expiryDate: null,
      image: require("../../assets/images/advanced_guide.png"),
      obtained: false,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Header />
        <View style={styles.dashboard}>
          <Text style={styles.title}>Certifications</Text>
          {certifications.map((cert, index) => (
            <View key={index} style={styles.certItem}>
              <Image source={cert.image} style={styles.certImage} />
              <View style={styles.certDetails}>
                <Text style={styles.certName}>{cert.name}</Text>
                {cert.obtained ? (
                  <Text style={styles.certExpiry}>Expiry: {cert.expiryDate}</Text>
                ) : (
                  <TouchableOpacity
                    style={styles.quizButton}
                    onPress={() => navigation.navigate("quiz", { certName: cert.name })}
                  >
                    <Text style={styles.quizButtonText}>Take Quiz</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -5,
    paddingBottom: 120,
    zIndex: 1,
    elevation: 10,
    padding: 20,
    flex: 1,
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
  quizButton: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgb(22, 163, 74)",
    borderRadius: 5,
  },
  quizButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Certificate;
