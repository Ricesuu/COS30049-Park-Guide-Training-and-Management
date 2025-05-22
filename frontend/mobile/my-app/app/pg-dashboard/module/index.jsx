import React, { useState, useRef, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

// Import Components
import ModuleContainer from "../../../components/PGdashboard/Module/ModuleContainer";
import ModuleList from "../../../components/PGdashboard/Module/ModuleList";
import ModuleDetailModal from "../../../components/PGdashboard/Module/ModuleDetailModal";

// Import Services
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
        // Navigate to module marketplace page
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
            console.error("Error submitting comment:", error);
            Alert.alert(
                "Error",
                "Failed to submit your comment. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadUserModules();
    };
    return (
        <ModuleContainer>
            <ModuleList
                modules={userModules}
                isLoading={isLoading}
                error={error}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                onModulePress={openModal}
                onBrowseModules={handleBrowseModules}
            />

            <ModuleDetailModal
                visible={modalVisible}
                module={selectedModule}
                onClose={closeModal}
                onCommentChange={setComment}
                commentValue={comment}
                onCommentSubmit={handleSubmitComment}
                isSubmitting={isSubmitting}
            />
        </ModuleContainer>
    );
};

export default ModuleIndex;
