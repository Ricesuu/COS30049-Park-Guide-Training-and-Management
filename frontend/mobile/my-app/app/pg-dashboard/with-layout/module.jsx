import React, { useState, useRef } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import { Video } from "expo-av"; // Import Video component from expo-av
import Header from "../../../components/PGdashboard/PGDashboardHome/Header";

const Module = () => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState("");
    const videoRef = useRef(null); // Reference for the Video component

    const modules = [
        {
            name: "First Aid Module",
            description:
                "Learn essential first aid skills, including CPR and wound care.",
            image: require("../../../assets/images/firstaid.jpg"),
            video: require("../../../assets/videos/firstaid.mp4"), // Reference local video file
        },
        {
            name: "Wildlife Safety Module",
            description:
                "Understand how to stay safe while interacting with wildlife.",
            image: require("../../../assets/images/wildlife_safety.jpg"),
            video: require("../../../assets/videos/wildlife_safety.mp4"), // Reference local video file
        },
        {
            name: "Advanced Park Guide Module",
            description:
                "Master advanced skills for park guides, including navigation and leadership.",
            image: require("../../../assets/images/advanced_guide.png"),
            video: require("../../../assets/videos/advanced_navigation.mp4"), // Reference local video file
        },
    ];

    const openModal = (module) => {
        setSelectedModule(module);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedModule(null);
        setModalVisible(false);
        setComment(""); // Clear the comment box when closing the modal
    };

    const handleFullScreen = async () => {
        if (videoRef.current) {
            await videoRef.current.presentFullscreenPlayer(); // Enter full-screen mode
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={styles.dashboard}>
                    <Text style={styles.title}>Modules</Text>
                    {modules.map((module, index) => (
                        <View key={index} style={styles.moduleItem}>
                            <Image
                                source={module.image}
                                style={styles.moduleImage}
                            />
                            <View style={styles.moduleDetails}>
                                <Text style={styles.moduleName}>
                                    {module.name}
                                </Text>
                                <Text style={styles.moduleDescription}>
                                    {module.description}
                                </Text>
                                <TouchableOpacity
                                    style={styles.infoButton}
                                    onPress={() => openModal(module)}
                                >
                                    <Text style={styles.infoButtonText}>
                                        View Module
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Modal for Module Details */}
            {selectedModule && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {selectedModule.name}
                            </Text>
                            <Image
                                source={selectedModule.image}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalText}>
                                {selectedModule.description}
                            </Text>
                            <Video
                                ref={videoRef} // Attach the reference to the Video component
                                source={selectedModule.video}
                                style={styles.videoPlayer}
                                useNativeControls // Enables built-in controls, including full-screen
                                resizeMode="contain"
                                shouldPlay={false}
                                volume={1.0}
                            />

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.closeButtonText}>
                                    Close
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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#333",
    },
    moduleItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    moduleImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    moduleDetails: {
        flex: 1,
    },
    moduleName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
    },
    moduleDescription: {
        fontSize: 14,
        color: "#888",
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
    videoPlayer: {
        width: "100%",
        height: 200,
        marginBottom: 10,
    },
    fullScreenButton: {
        marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#007BFF",
        borderRadius: 5,
    },
    fullScreenButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
    commentBox: {
        width: "100%",
        height: 40,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    submitButton: {
        marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#007BFF",
        borderRadius: 5,
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
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

export default Module;
