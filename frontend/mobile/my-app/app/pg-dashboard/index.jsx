import React, { useState, useEffect } from "react";
import { StyleSheet, LogBox, View, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

import Dashboard from "../../components/PGdashboard/Common/Dashboard";
import ProfileView from "../../components/PGdashboard/PGDashboardHome/ProfileView";
import CertContainer from "../../components/PGdashboard/PGDashboardHome/certcontainer";
import TrainingProgressContainer from "../../components/PGdashboard/PGDashboardHome/trainingProgressContainer";
import LogoutButton from "../../components/PGdashboard/Common/LogoutButton";

// API URL - This should come from a constants file or environment variable
import { API_URL } from "../../src/constants/constants";

const HomePage = () => {
    const { authUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [certifications, setCertifications] = useState([]);
    const [trainingProgress, setTrainingProgress] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [parkGuideInfo, setParkGuideInfo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, [authUser]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchAllData().finally(() => setRefreshing(false));
    }, []);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchUserProfile(),
                fetchParkGuideInfo(),
                fetchCertifications(),
                fetchTrainingProgress(),
            ]);
            setError(null);
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            setError("Failed to load dashboard information. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await axios.get(`${API_URL}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserProfile(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setUserProfile(null);
        }
    };

    const fetchParkGuideInfo = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await axios.get(
                `${API_URL}/api/park-guides/user`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setParkGuideInfo(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching park guide info:", error);
            setParkGuideInfo(null);
        }
    };

    const fetchCertifications = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication required");
            }

            // First get the guide's information to get the guide_id
            const guideResponse = await axios.get(
                `${API_URL}/api/park-guides/user`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!guideResponse.data || !guideResponse.data.guide_id) {
                console.log("No guide information found");
                setCertifications([]);
                return [];
            }

            const guideId = guideResponse.data.guide_id;

            // Now fetch both ongoing training progress and completed certifications
            const [certResponse, progressResponse] = await Promise.all([
                axios.get(`${API_URL}/api/certifications/user/${guideId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                axios.get(`${API_URL}/api/guide-training-progress/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            console.log("Fetched certifications:", certResponse.data);
            console.log("Fetched training progress:", progressResponse.data);

            // Map completed certifications
            const completedCertifications = certResponse.data.map((cert) => ({
                id: cert.cert_id,
                module_id: cert.module_id,
                module_name: cert.module_name,
                name: cert.module_name,
                issued_date: cert.issued_date,
                expiry_date: cert.expiry_date,
                description: cert.description,
                status: "completed",
            }));

            // Map ongoing training
            const ongoingCertifications = progressResponse.data
                .filter((progress) => progress.status === "in progress")
                .map((progress) => ({
                    id: progress.progress_id,
                    module_id: progress.module_id,
                    module_name: progress.module_name,
                    name: progress.module_name,
                    status: "ongoing",
                    progress: progress.completion_percentage || 0,
                }));

            // Combine both arrays
            const allCertifications = [
                ...completedCertifications,
                ...ongoingCertifications,
            ];

            setCertifications(allCertifications);
            return allCertifications;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No certifications found for this guide");
                setCertifications([]);
                return [];
            }
            console.error("Error fetching certifications:", error);
            throw error;
        }
    };

    const fetchTrainingProgress = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await axios.get(
                `${API_URL}/api/guide-training-progress/user`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTrainingProgress(response.data || []);
            return response.data;
        } catch (error) {
            console.error("Error fetching training progress:", error);
            setTrainingProgress([]);
            return [];
        }
    };
    return (
        <Dashboard onRefresh={onRefresh} refreshing={refreshing}>
            <ProfileView
                fullName={
                    userProfile
                        ? `${userProfile.first_name} ${userProfile.last_name}`
                        : "Loading..."
                }
                guideId={parkGuideInfo?.guide_id || "Loading..."}
            />
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading your data...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <>
                    <CertContainer certifications={certifications} />
                    <TrainingProgressContainer
                        trainingProgress={trainingProgress}
                    />
                </>
            )}
            <LogoutButton />
        </Dashboard>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        margin: 15,
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        padding: 20,
        margin: 15,
        backgroundColor: "#fee2e2",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ef4444",
    },
    errorText: {
        color: "#dc2626",
        textAlign: "center",
        fontSize: 16,
    },
});

export default HomePage;
