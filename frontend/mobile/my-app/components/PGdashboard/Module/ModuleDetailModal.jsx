// components/PGdashboard/Module/ModuleDetailModal.jsx
import React, { useRef } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Video } from "expo-av";

const ModuleDetailModal = ({
    visible,
    module,
    onClose,
    onCommentChange,
    commentValue,
    onCommentSubmit,
    isSubmitting,
}) => {
    const videoRef = useRef(null);

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{module?.title}</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <AntDesign name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    {module?.video_url && (
                        <View style={styles.videoContainer}>
                            <Video
                                ref={videoRef}
                                source={{ uri: module.video_url }}
                                useNativeControls
                                resizeMode="contain"
                                style={styles.video}
                            />{" "}
                        </View>
                    )}
                    <View style={styles.moduleDetails}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>
                            {module?.description}
                        </Text>
                        {module?.objectives ? (
                            <>
                                <Text style={styles.sectionTitle}>
                                    Learning Objectives
                                </Text>
                                <Text style={styles.objectives}>
                                    {module.objectives}
                                </Text>
                            </>
                        ) : null}
                        <Text style={styles.sectionTitle}>Complete Status</Text>
                        <View style={styles.statusContainer}>
                            <View
                                style={[
                                    styles.statusIndicator,
                                    {
                                        backgroundColor: module?.is_completed
                                            ? "#4CAF50"
                                            : "#FFC107",
                                    },
                                ]}
                            />
                            <Text style={styles.statusText}>
                                {module?.is_completed
                                    ? "Completed"
                                    : "In Progress"}
                            </Text>
                        </View>
                        <Text style={styles.sectionTitle}>Leave a Comment</Text>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Share your thoughts on this module..."
                            multiline={true}
                            value={commentValue}
                            onChangeText={onCommentChange}
                        />
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                isSubmitting && styles.submitButtonDisabled,
                            ]}
                            onPress={onCommentSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.submitButtonText}>
                                {isSubmitting
                                    ? "Submitting..."
                                    : "Submit Comment"}
                            </Text>
                        </TouchableOpacity>
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
    videoContainer: {
        aspectRatio: 16 / 9,
        backgroundColor: "#000",
        marginBottom: 15,
    },
    video: {
        width: "100%",
        height: "100%",
    },
    moduleDetails: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 15,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
    },
    objectives: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        color: "#333",
    },
    commentInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 5,
        padding: 10,
        height: 100,
        textAlignVertical: "top",
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: "#16a34a",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 30,
    },
    submitButtonDisabled: {
        backgroundColor: "#A0D8B3",
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default ModuleDetailModal;
