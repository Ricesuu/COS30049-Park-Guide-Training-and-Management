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
import { useRouter } from "expo-router";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";

const Certificate = () => {
    const router = useRouter();
    const [selectedCert, setSelectedCert] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const certifications = [
        {
            name: "First Aid Certification",
            expiryDate: "2025-12-31",
            image: require("../../assets/images/firstaid.jpg"),
            obtained: true,
            description:
                "This certification covers essential first aid skills, including CPR and wound care.",
        },
        {
            name: "Semenggoh Wildlife Centre Certification",
            expiryDate: "2026-06-30",
            image: require("../../assets/images/Semenggoh.jpeg"),
            obtained: true,
            description:
                "This certification focuses on wildlife conservation and safety practices.",
        },
        {
            name: "Wildlife Safety Certification",
            expiryDate: null,
            image: require("../../assets/images/wildlife_safety.jpg"),
            obtained: false,
            description:
                "Learn how to stay safe while interacting with wildlife in natural habitats.",
        },
        {
            name: "Advanced Park Guide Certification",
            expiryDate: null,
            image: require("../../assets/images/advanced_guide.png"),
            obtained: false,
            description:
                "This certification provides advanced skills for park guides, including navigation and leadership.",
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
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={styles.dashboard}>
                    <Text style={styles.title}>Certifications</Text>
                    {certifications.map((cert, index) => (
                        <View key={index} style={styles.certItem}>
                            <Image
                                source={cert.image}
                                style={styles.certImage}
                            />
                            <View style={styles.certDetails}>
                                <Text style={styles.certName}>{cert.name}</Text>
                                {cert.obtained ? (
                                    <>
                                        <Text style={styles.certExpiry}>
                                            Expiry: {cert.expiryDate}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.infoButton}
                                            onPress={() => openModal(cert)}
                                        >
                                            <Text style={styles.infoButtonText}>
                                                More Info
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.quizButton}
                                        onPress={() =>
                                            router.push({
                                                pathname: '/pg-dashboard/quiz',
                                                params: { certName: cert.name }
                                            })
                                        }
                                    >
                                        <Text style={styles.quizButtonText}>
                                            Take Quiz
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Modal for Certificate Details */}
            {selectedCert && (
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
                                {selectedCert.name}
                            </Text>
                            <Image
                                source={selectedCert.image}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalExpiry}>
                                Expiry Date: {selectedCert.expiryDate}
                            </Text>
                            <Text style={styles.modalDescription}>
                                {selectedCert.description}
                            </Text>
                            <TouchableOpacity
                                style={styles.downloadButton}
                                onPress={() => {
                                    // Handle certificate download
                                    console.log(
                                        `Download certificate: ${selectedCert.name}`
                                    );
                                }}
                            >
                                <Text style={styles.downloadButtonText}>
                                    Download Certificate
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.renewButton}
                                onPress={() => {
                                    // Handle certificate renewal
                                    console.log(
                                        `Renew certificate: ${selectedCert.name}`
                                    );
                                }}
                            >
                                <Text style={styles.renewButtonText}>
                                    Renew Certificate
                                </Text>
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
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "rgb(22, 163, 74)",
    },
    certItem: {
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
    certImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    certDetails: {
        marginLeft: 10,
        flex: 1,
    },
    certName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    certExpiry: {
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
    quizButton: {
        backgroundColor: "#f0ad4e",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: "flex-start",
    },
    quizButtonText: {
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
        alignItems: "center",
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
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
    },
    modalExpiry: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 16,
        color: "#333",
        marginBottom: 15,
        textAlign: "center",
    },
    downloadButton: {
        backgroundColor: "rgb(22, 163, 74)",
        padding: 10,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    downloadButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    renewButton: {
        backgroundColor: "#f0ad4e",
        padding: 10,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    renewButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default Certificate;
