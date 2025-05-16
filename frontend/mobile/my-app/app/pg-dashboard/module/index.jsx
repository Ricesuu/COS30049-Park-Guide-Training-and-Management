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
    Alert,
    RefreshControl,
} from "react-native";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import Header from "../../../components/PGdashboard/PGDashboardHome/Header";
import {
    fetchUserModules,
    submitComment,
} from "../../../services/moduleService";

const ModuleIndex = () => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState("");
    const [userModules, setUserModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const videoRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        loadUserModules();

        // Set up a periodic refresh if needed
        const refreshInterval = setInterval(() => {
            loadUserModules(true); // Quiet refresh (no loading indicator)
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(refreshInterval);
    }, []);

    const loadUserModules = async (quiet = false) => {
        if (!quiet) setIsLoading(true);
        try {
            const modules = await fetchUserModules();
            console.log("Loaded modules:", modules);
            setUserModules(modules);
            setError(null);
        } catch (error) {
            console.error("Error loading modules:", error);
            if (!quiet) {
                setError(
                    "Failed to load your modules. Please try again later."
                );
            }
        } finally {
            if (!quiet) setIsLoading(false);
            setRefreshing(false);
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
        // Navigate to module marketplace (now a separate page)
        console.log("Navigating to module marketplace...");
        router.push("/pg-dashboard/marketplace");
    };

    const handleSubmitComment = async () => {
        if (!comment.trim()) {
            Alert.alert("Error", "Please enter a comment before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitComment(selectedModule.id, comment);
            Alert.alert(
                "Success",
                "Your comment has been submitted successfully."
            );
            setComment(""); // Clear comment field after submission
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to submit comment. Please try again later."
            );
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleTakeQuiz = () => {
        // Navigate to the quiz page with the module ID (updated path)
        router.push(`/pg-dashboard/module/quiz?moduleId=${selectedModule.id}`);
    };
    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No Modules Found</Text>
            <Text style={styles.emptyStateText}>
                You haven't sign up for any modules yet. Browse our marketplace
                to find modules that can help you improve your park guide
                skills.
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
        <>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            loadUserModules();
                        }}
                        colors={["rgb(22, 163, 74)"]}
                        tintColor="rgb(22, 163, 74)"
                    />
                }
            >
                <View>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="large"
                                color="rgb(22, 163, 74)"
                            />
                            <Text style={styles.loadingText}>
                                Loading your modules...
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={loadUserModules}
                            >
                                <Text style={styles.retryButtonText}>
                                    Retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : userModules.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        <View>
                            <View style={styles.headerRow}>
                                <Text style={styles.title}>Your Modules</Text>
                                <TouchableOpacity
                                    style={styles.browseModulesButton}
                                    onPress={handleBrowseModules}
                                >
                                    <Text
                                        style={styles.browseModulesButtonText}
                                    >
                                        Browse More Modules
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.moduleCount}>
                                {userModules.length}{" "}
                                {userModules.length === 1
                                    ? "module"
                                    : "modules"}{" "}
                                found
                            </Text>
                            {userModules.map((module, index) => (
                                <View key={index} style={styles.moduleItem}>
                                    <Image
                                        source={{ uri: module.imageUrl }}
                                        style={styles.moduleImage}
                                        defaultSource={require("../../../assets/images/module-placeholder.png")}
                                        onError={(e) =>
                                            console.log(
                                                "Image failed to load:",
                                                e.nativeEvent.error
                                            )
                                        }
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
                                    <ActivityIndicator
                                        size="small"
                                        color="white"
                                    />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        Submit Comment
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quizButton}
                                onPress={handleTakeQuiz}
                            >
                                <Text style={styles.quizButtonText}>
                                    Take Quiz
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </>
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
        color: "rgb(22, 163, 74)",
        marginBottom: 5,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    browseModulesButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: "rgb(22, 163, 74)",
        borderRadius: 10,
    },
    browseModulesButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
    moduleCount: {
        fontSize: 16,
        color: "#666",
        marginBottom: 15,
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
        backgroundColor: "#e0e0e0",
    },
    moduleDetails: {
        marginLeft: 10,
        flex: 1,
    },
    moduleName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
    },
    moduleDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
        marginBottom: 10,
    },
    infoButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: "flex-start",
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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        width: "100%",
        maxHeight: "90%",
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
        paddingRight: 30, // Make space for close button
    },
    videoContainer: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 15,
        backgroundColor: "#000",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    modalDescription: {
        fontSize: 16,
        color: "#333",
        marginBottom: 20,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
        fontSize: 14,
        minHeight: 80,
        maxHeight: 120,
        marginBottom: 15,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    quizButton: {
        backgroundColor: "#2980b9", // Different color for distinction
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    quizButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    browseButton: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    browseButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ModuleIndex;
