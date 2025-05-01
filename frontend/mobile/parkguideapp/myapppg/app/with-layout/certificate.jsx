import React, { useState } from "react";
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/PGDashboardHome/Header";

const Certificate = () => {
  const navigation = useNavigation();
  const [selectedCert, setSelectedCert] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const certifications = [
    {
      name: "First Aid Certification",
      expiryDate: "2025-12-31",
      image: require("../../assets/images/firstaid.jpg"),
      obtained: true,
      description: "This certification covers essential first aid skills, including CPR and wound care.",
    },
    {
      name: "Semenggoh Wildlife Centre Certification",
      expiryDate: "2026-06-30",
      image: require("../../assets/images/Semenggoh.jpeg"),
      obtained: true,
      description: "This certification focuses on wildlife conservation and safety practices.",
    },
    {
      name: "Wildlife Safety Certification",
      expiryDate: null,
      image: require("../../assets/images/wildlife_safety.jpg"),
      obtained: false,
      description: "Learn how to stay safe while interacting with wildlife in natural habitats.",
    },
    {
      name: "Advanced Park Guide Certification",
      expiryDate: null,
      image: require("../../assets/images/advanced_guide.png"),
      obtained: false,
      description: "This certification provides advanced skills for park guides, including navigation and leadership.",
    },
  ];

  const openModal = (cert) => {
    setSelectedCert(cert);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedCert(null);
    setModalVisible(false);
  };

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
                  <>
                    <Text style={styles.certExpiry}>Expiry: {cert.expiryDate}</Text>
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() => openModal(cert)}
                    >
                      <Text style={styles.infoButtonText}>More Info</Text>
                    </TouchableOpacity>
                  </>
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

      {/* Modal for Certification Details */}
      {selectedCert && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCert.name}</Text>
              <Image source={selectedCert.image} style={styles.modalImage} />
              <Text style={styles.modalText}>{selectedCert.description}</Text>
              {selectedCert.expiryDate && (
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Expiry Date: </Text>
                  {selectedCert.expiryDate}
                </Text>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  infoButton: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  infoButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "rgb(22, 163, 74)",
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgb(22, 163, 74)",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Certificate;
