import React, { useState, useEffect } from "react";
import { Alert, LogBox } from "react-native";
import { useRouter } from "expo-router";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../src/constants/constants";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

// Import Components
import ProfileDashboard from "../../components/PGdashboard/Profile/ProfileDashboard";
import UserInfoCard from "../../components/PGdashboard/Profile/UserInfoCard";
import AssignedParkCard from "../../components/PGdashboard/Profile/AssignedParkCard";
import CertificationsCard from "../../components/PGdashboard/Profile/CertificationsCard";
import TrainingProgressCard from "../../components/PGdashboard/Profile/TrainingProgressCard";
import PaymentHistoryCard from "../../components/PGdashboard/Profile/PaymentHistoryCard";
import EditProfileButton from "../../components/PGdashboard/Profile/EditProfileButton";

const Profile = () => {
    const router = useRouter();
    const { authUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [parkGuideInfo, setParkGuideInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [certifications, setCertifications] = useState([]);
    const [trainingProgress, setTrainingProgress] = useState([]);
    const [assignedPark, setAssignedPark] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        fetchAllUserData();
    }, []);

    const onRefresh = React.useCallback(() => {
        setIsRefreshing(true);
        fetchAllUserData().finally(() => {
            setIsRefreshing(false);
        });
    }, []);

    const fetchAllUserData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchUserProfile(),
                fetchParkGuideInfo(),
                fetchUserCertifications(),
                fetchTrainingProgress(),
                fetchPaymentHistory(),
            ]);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Failed to load profile information. Please try again.");
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
            setError(null);
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setError("Failed to load profile information. Please try again.");
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

            setParkGuideInfo(response.data); // If park guide has an assigned park, fetch it
            if (response.data) {
                console.log("Park guide info received:", response.data);

                if (
                    response.data.assigned_park &&
                    response.data.assigned_park !== "Unassigned" &&
                    response.data.assigned_park !== "unassigned" &&
                    response.data.assigned_park !== "null"
                ) {
                    console.log(
                        `Assigned park detected: ${response.data.assigned_park}`
                    );
                    fetchAssignedPark(response.data.assigned_park, token);
                } else {
                    console.log("No assigned park found for this guide");
                    setAssignedPark(null);
                }
            }

            return response.data;
        } catch (error) {
            console.error("Error fetching park guide info:", error);
            // Don't throw error to allow other data to load
            return null;
        }
    };
    const fetchAssignedPark = async (parkId, token) => {
        try {
            if (!parkId || !token) {
                console.log("Missing parkId or token for fetching park info");
                setAssignedPark(null);
                return;
            }

            // Add better logging to debug the park ID
            console.log(`Fetching park with ID: ${parkId}`);

            // Check if parkId is valid
            if (
                parkId === "Unassigned" ||
                parkId === "unassigned" ||
                parkId === "null"
            ) {
                console.log("Park guide is not assigned to a specific park");
                setAssignedPark(null);
                return;
            }

            const response = await axios.get(`${API_URL}/api/parks/${parkId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAssignedPark(response.data);
        } catch (error) {
            console.error("Error fetching assigned park:", error);
            // Just set to null to show "No park assigned" in our component
            setAssignedPark(null);
        }
    };

    const fetchUserCertifications = async () => {
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

            setCertifications(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching certifications:", error);
            return [];
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

            setTrainingProgress(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching training progress:", error);
            return [];
        }
    };

    const fetchPaymentHistory = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");

            if (!token) {
                throw new Error("Authentication required");
            }

            const response = await axios.get(
                `${API_URL}/api/payment-transactions/user-history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPaymentHistory(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching payment history:", error);
            return [];
        }
    };

    const handleLogout = async () => {
        Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                onPress: async () => {
                    try {
                        // Clear all stored tokens and user data
                        await AsyncStorage.multiRemove([
                            "authToken",
                            "userRole",
                            "userId",
                        ]);

                        // Navigate to login screen
                        router.replace("/");
                    } catch (error) {
                        console.error("Error during logout:", error);
                        Alert.alert(
                            "Logout Error",
                            "Failed to log out. Please try again."
                        );
                    }
                },
            },
        ]);
    };
    return (
        <ProfileDashboard
            isLoading={isLoading}
            error={error}
            onRetry={fetchAllUserData}
            onLogout={handleLogout}
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
        >
            <UserInfoCard
                userProfile={userProfile}
                parkGuideInfo={parkGuideInfo}
            />
            <AssignedParkCard assignedPark={assignedPark} />
            <CertificationsCard certifications={certifications} />
            <TrainingProgressCard trainingProgress={trainingProgress} />
            <PaymentHistoryCard paymentHistory={paymentHistory} />
            <EditProfileButton />
        </ProfileDashboard>
    );
};

export default Profile;
