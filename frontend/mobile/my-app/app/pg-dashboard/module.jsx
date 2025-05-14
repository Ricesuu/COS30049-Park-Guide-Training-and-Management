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
import { Video } from "expo-av";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";

const Module = () => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState("");
    const videoRef = useRef(null);

    const modules = [
        {
            name: "First Aid Module",
            description:
                "Learn essential first aid skills, including CPR and wound care.",
            image: require("../../assets/images/firstaid.jpg"),
            video: require("../../assets/videos/firstaid.mp4"),
        },
        {
            name: "Wildlife Safety Module",
            description:
                "Understand how to stay safe while interacting with wildlife.",
            image: require("../../assets/images/wildlife_safety.jpg"),
            video: require("../../assets/videos/wildlife_safety.mp4"),
        },
        {
            name: "Advanced Park Guide Module",
            description:
                "Master advanced skills for park guides, including navigation and leadership.",
            image: require("../../assets/images/advanced_guide.png"),
            video: require("../../assets/videos/advanced_navigation.mp4"),
        },
    ];

    const openModal = (module) => {
        setSelectedModule(module);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedModule(null);
        setModalVisible(false);
        setComment("");
    };

    const handleFullScreen = async () => {
        if (videoRef.current) {
            await videoRef.current.presentFullscreenPlayer();
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
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>
                                {selectedModule.name}
                            </Text>

                            {/* Video Player */}
                            <TouchableOpacity
                                onPress={handleFullScreen}
                                style={styles.videoContainer}
                            >
                                <Video
                                    ref={videoRef}
                                    source={selectedModule.video}
                                    rate={1.0}
                                    volume={1.0}
                                    isMuted={false}
                                    resizeMode="cover"
                                    shouldPlay={false}
                                    isLooping={false}
                                    useNativeControls
                                    style={styles.video}
                                />
                            </TouchableOpacity>

                            <Text style={styles.modalDescription}>
                                {selectedModule.description}
                            </Text>

                            <TextInput
                                style={styles.commentInput}
                                placeholder="Add a comment..."
                                value={comment}
                                onChangeText={setComment}
                                multiline
                            />

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => {
                                    // Handle comment submission
                                    console.log(
                                        `Comment for ${selectedModule.name}: ${comment}`
                                    );
                                    setComment(""); // Clear comment field after submission
                                }}
                            >
                                <Text style={styles.submitButtonText}>
                                    Submit Comment
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quizButton}
                                onPress={() => {
                                    // Handle navigate to quiz
                                    console.log(
                                        `Navigate to quiz for ${selectedModule.name}`
                                    );
                                    closeModal(); // Close the modal before navigating
                                    // navigation.navigate("Quiz", { moduleName: selectedModule.name });
                                }}
                            >
                                <Text style={styles.quizButtonText}>
                                    Take Quiz
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
    moduleItem: {
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
    moduleImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    moduleDetails: {
        marginLeft: 10,
        flex: 1,
    },
    moduleName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    moduleDescription: {
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
        maxHeight: "90%",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        right: 15,
        top: 15,
        zIndex: 10,
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
    },
    videoContainer: {
        width: "100%",
        aspectRatio: 16 / 9,
        marginBottom: 15,
        borderRadius: 10,
        overflow: "hidden",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    modalDescription: {
        fontSize: 16,
        color: "#333",
        marginBottom: 15,
        textAlign: "center",
    },
    commentInput: {
        width: "100%",
        height: 80,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: "rgb(22, 163, 74)",
        padding: 10,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    quizButton: {
        backgroundColor: "#f0ad4e",
        padding: 10,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    quizButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default Module;
