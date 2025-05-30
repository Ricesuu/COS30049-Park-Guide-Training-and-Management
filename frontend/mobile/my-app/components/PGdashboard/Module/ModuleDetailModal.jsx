// components/PGdashboard/Module/ModuleDetailModal.jsx
import React from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
    Alert,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const ModuleDetailModal = ({ visible, module, onClose }) => {
    console.log("Module data in modal:", module); // Debug log

    // Handle opening YouTube links with error handling
    const handleYouTubeLink = async () => {
        const videoUrl = module?.videoUrl || module?.video_url;
        if (videoUrl) {
            try {
                const supported = await Linking.canOpenURL(videoUrl);
                if (supported) {
                    await Linking.openURL(videoUrl);
                } else {
                    Alert.alert("Error", "Cannot open this YouTube link");
                }
            } catch (error) {
                Alert.alert("Error", "Failed to open YouTube link");
            }
        }
    };

    // Support both camelCase and snake_case property names for compatibility
    const moduleTitle = module?.name || module?.title;
    const moduleDifficulty = module?.difficulty_level || module?.difficulty;
    const moduleAspect = module?.training_aspect || module?.aspect;
    const moduleContent = module?.course_content || module?.courseContent;
    const videoUrl = module?.videoUrl || module?.video_url;

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{moduleTitle}</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <AntDesign name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.moduleMetadata}>
                        {moduleDifficulty && (
                            <View style={styles.metadataBox}>
                                <MaterialIcons
                                    name="signal-cellular-alt"
                                    size={20}
                                    color="#4B5563"
                                />
                                <Text style={styles.metadataLabel}>
                                    Difficulty
                                </Text>
                                <Text style={styles.metadataValue}>
                                    {moduleDifficulty}
                                </Text>
                            </View>
                        )}
                        {moduleAspect && (
                            <View style={styles.metadataBox}>
                                <MaterialIcons
                                    name="category"
                                    size={20}
                                    color="#4B5563"
                                />
                                <Text style={styles.metadataLabel}>Aspect</Text>
                                <Text style={styles.metadataValue}>
                                    {moduleAspect}
                                </Text>
                            </View>
                        )}
                    </View>

                    {videoUrl && (
                        <TouchableOpacity
                            style={styles.youtubeButton}
                            onPress={handleYouTubeLink}
                        >
                            <MaterialIcons
                                name="youtube-searched-for"
                                size={24}
                                color="#FF0000"
                            />
                            <Text style={styles.youtubeButtonText}>
                                Watch on YouTube
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.moduleDetails}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>
                            {module?.description}
                        </Text>

                        {moduleContent && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    Course Content
                                </Text>
                                <Text style={styles.content}>
                                    {moduleContent}
                                </Text>
                            </>
                        )}

                        {module?.objectives && (
                            <>
                                <Text style={styles.sectionTitle}>
                                    Learning Objectives
                                </Text>
                                <Text style={styles.objectives}>
                                    {module.objectives}
                                </Text>
                            </>
                        )}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
    },
    closeButton: {
        padding: 5,
    },
    modalContent: {
        flex: 1,
    },
    moduleMetadata: {
        padding: 15,
        backgroundColor: "#F9FAFB",
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 15,
        marginBottom: 10,
    },
    metadataBox: {
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 12,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        minWidth: 120,
    },
    metadataLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 4,
        textTransform: "uppercase",
    },
    metadataValue: {
        fontSize: 16,
        color: "#111827",
        fontWeight: "600",
        marginTop: 2,
        textTransform: "capitalize",
    },
    youtubeButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF",
        padding: 15,
        margin: 15,
        borderRadius: 8,
        gap: 8,
        borderWidth: 1,
        borderColor: "#FF0000",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    youtubeButtonText: {
        color: "#FF0000",
        fontWeight: "600",
        fontSize: 16,
    },
    moduleDetails: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
        color: "#111827",
    },
    description: {
        fontSize: 15,
        color: "#374151",
        lineHeight: 22,
    },
    content: {
        fontSize: 15,
        color: "#374151",
        lineHeight: 22,
        marginBottom: 15,
    },
    objectives: {
        fontSize: 15,
        color: "#374151",
        lineHeight: 22,
    },
});

export default ModuleDetailModal;
