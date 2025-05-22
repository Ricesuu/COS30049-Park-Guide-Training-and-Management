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

    useEffect(() => {
        fetchAllData();
    }, [authUser]);

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
            throw error;
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
            throw error;
        }
    };

    const fetchCertifications = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await axios.get(
                `${API_URL}/api/certifications/user`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCertifications(response.data || []);
            return response.data;
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
        <Dashboard>
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
