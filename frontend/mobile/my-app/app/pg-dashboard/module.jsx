import React, { useState, useRef, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    ActivityIndicator,
    Alert
} from "react-native";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";
import { fetchUserModules, submitComment } from "../../services/moduleService";

const Module = () => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState("");
    const [userModules, setUserModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const videoRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        loadUserModules();
    }, []);

    const loadUserModules = async () => {
        setIsLoading(true);
        try {
            const modules = await fetchUserModules();
            setUserModules(modules);
            setError(null);
        } catch (error) {
            setError("Failed to load your modules. Please try again later.");
            console.error("Error loading modules:", error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleBrowseModules = () => {
        // Navigate to module marketplace
        router.push("/pg-dashboard/module-marketplace");
    };

    const handleSubmitComment = async () => {
        if (!comment.trim()) {
            Alert.alert("Error", "Please enter a comment before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitComment(selectedModule.id, comment);
            Alert.alert("Success", "Your comment has been submitted successfully.");
            setComment(""); // Clear comment field after submission
        } catch (error) {
            Alert.alert("Error", "Failed to submit comment. Please try again later.");
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTakeQuiz = () => {
        // Navigate to the quiz page with the module ID
        router.push(`/pg-dashboard/quiz?moduleId=${selectedModule.id}`);
    };

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No Modules Found</Text>
            <Text style={styles.emptyStateText}>
                You haven't purchased any modules yet. Browse our marketplace to find modules
                that can help you improve your park guide skills.
            </Text>
            <TouchableOpacity
                style={styles.browseButton}
                onPress={handleBrowseModules}
            >
                <Text style={styles.browseButtonText}>Browse Modules</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={styles.dashboard}>
                    <Text style={styles.title}>Your Modules</Text>
                    
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="rgb(22, 163, 74)" />
                            <Text style={styles.loadingText}>Loading your modules...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={loadUserModules}
                            >
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : userModules.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        userModules.map((module, index) => (
                            <View key={index} style={styles.moduleItem}>
                                <Image
                                    source={{ uri: module.imageUrl }}
                                    style={styles.moduleImage}
                                    defaultSource={require('../../assets/images/module-placeholder.png')}
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
                        ))
                    )}
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
                                    source={{ uri: selectedModule.videoUrl }}
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
                                onPress={handleSubmitComment}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        Submit Comment
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quizButton}
                                onPress={() => {
                                    closeModal(); // Close the modal before navigating
                                    router.push({
                                        pathname: "/pg-dashboard/quiz",
                                        params: { moduleId: selectedModule.id }
                                    });
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: 'rgb(22, 163, 74)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    browseButton: {
        backgroundColor: 'rgb(22, 163, 74)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    browseButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
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
        backgroundColor: '#e0e0e0', // Placeholder color
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
