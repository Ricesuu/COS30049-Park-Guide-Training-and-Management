import React, { useState } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from "react-native";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";

const PlantInfo = () => {
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const orchids = [
        {
            name: "Phalaenopsis Orchid",
            description:
                "Also known as the 'Moth Orchid', it is one of the most popular orchids.",
            image: require("../../assets/images/phalaenopsis.jpg"),
            scientificName: "Phalaenopsis",
            habitat: "Tropical Asia and Australia",
            funFact:
                "It is called the 'Moth Orchid' because its flowers resemble moths in flight.",
        },
        {
            name: "Cattleya Orchid",
            description:
                "Known as the 'Queen of Orchids', it is famous for its large, fragrant flowers.",
            image: require("../../assets/images/cattleya.jpg"),
            scientificName: "Cattleya",
            habitat: "Tropical America",
            funFact:
                "Cattleya orchids are often used in corsages due to their beauty and fragrance.",
        },
        {
            name: "Dendrobium Orchid",
            description: "A diverse genus of orchids with over 1,800 species.",
            image: require("../../assets/images/dendrobium.jpg"),
            scientificName: "Dendrobium",
            habitat: "Asia, Australia, and the Pacific Islands",
            funFact:
                "Dendrobium orchids are used in traditional medicine in some cultures.",
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
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={styles.dashboard}>
                    <Text style={styles.title}>Orchid Information</Text>
                    {orchids.map((orchid, index) => (
                        <View key={index} style={styles.plantItem}>
                            <Image
                                source={orchid.image}
                                style={styles.plantImage}
                            />
                            <View style={styles.plantDetails}>
                                <Text style={styles.plantName}>
                                    {orchid.name}
                                </Text>
                                <Text style={styles.plantDescription}>
                                    {orchid.description}
                                </Text>
                                <TouchableOpacity
                                    style={styles.infoButton}
                                    onPress={() => openModal(orchid)}
                                >
                                    <Text style={styles.infoButtonText}>
                                        More Info
                                    </Text>
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
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>
                                {selectedPlant.name}
                            </Text>
                            <Image
                                source={selectedPlant.image}
                                style={styles.modalImage}
                            />
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>
                                    Scientific Name:
                                </Text>
                                <Text style={styles.infoText}>
                                    {selectedPlant.scientificName}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Habitat:</Text>
                                <Text style={styles.infoText}>
                                    {selectedPlant.habitat}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>
                                    Description:
                                </Text>
                                <Text style={styles.infoText}>
                                    {selectedPlant.description}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Fun Fact:</Text>
                                <Text style={styles.infoText}>
                                    {selectedPlant.funFact}
                                </Text>
                            </View>
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
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "rgb(22, 163, 74)",
    },
    plantItem: {
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    plantImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    plantDetails: {
        marginLeft: 10,
        flex: 1,
    },
    plantName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    plantDescription: {
        fontSize: 14,
        marginTop: 4,
        color: "#666",
    },
    infoButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: "flex-start",
    },
    infoButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        width: "90%",
        borderRadius: 20,
        padding: 20,
    },
    closeButton: {
        position: "absolute",
        right: 15,
        top: 15,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
        marginBottom: 15,
        marginTop: 10,
    },
    modalImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    infoItem: {
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    infoText: {
        fontSize: 16,
        color: "#333",
    },
});

export default PlantInfo;
