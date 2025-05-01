import React, { useState } from "react";
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Header from "../../components/PGDashboardHome/Header";

const PlantInfo = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const orchids = [
    {
      name: "Phalaenopsis Orchid",
      description: "Also known as the 'Moth Orchid', it is one of the most popular orchids.",
      image: require("../../assets/images/phalaenopsis.jpg"),
      scientificName: "Phalaenopsis",
      habitat: "Tropical Asia and Australia",
      funFact: "It is called the 'Moth Orchid' because its flowers resemble moths in flight.",
    },
    {
      name: "Cattleya Orchid",
      description: "Known as the 'Queen of Orchids', it is famous for its large, fragrant flowers.",
      image: require("../../assets/images/cattleya.jpg"),
      scientificName: "Cattleya",
      habitat: "Tropical America",
      funFact: "Cattleya orchids are often used in corsages due to their beauty and fragrance.",
    },
    {
      name: "Dendrobium Orchid",
      description: "A diverse genus of orchids with over 1,800 species.",
      image: require("../../assets/images/dendrobium.jpg"),
      scientificName: "Dendrobium",
      habitat: "Asia, Australia, and the Pacific Islands",
      funFact: "Dendrobium orchids are used in traditional medicine in some cultures.",
    },
  ];

  const openModal = (plant) => {
    setSelectedPlant(plant);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPlant(null);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Header />
        <View style={styles.dashboard}>
          <Text style={styles.title}>Orchid Information</Text>
          {orchids.map((orchid, index) => (
            <View key={index} style={styles.plantItem}>
              <Image source={orchid.image} style={styles.plantImage} />
              <View style={styles.plantDetails}>
                <Text style={styles.plantName}>{orchid.name}</Text>
                <Text style={styles.plantDescription}>{orchid.description}</Text>
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => openModal(orchid)}
                >
                  <Text style={styles.infoButtonText}>More Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal for Orchid Details */}
      {selectedPlant && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedPlant.name}</Text>
              <Image source={selectedPlant.image} style={styles.modalImage} />
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Scientific Name: </Text>
                {selectedPlant.scientificName}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Habitat: </Text>
                {selectedPlant.habitat}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Fun Fact: </Text>
                {selectedPlant.funFact}
              </Text>
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
  plantItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  plantImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  plantDetails: {
    flex: 1,
  },
  plantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  plantDescription: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  infoButton: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgb(22, 163, 74)",
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

export default PlantInfo;