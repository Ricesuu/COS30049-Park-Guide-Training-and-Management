import React, { useState, useEffect } from "react";
import { StyleSheet, LogBox, View, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

import Dashboard from "../../components/PGdashboard/Common/Dashboard";
import ProfileView from "../../components/PGdashboard/PGDashboardHome/ProfileView";
import CertContainer from "../../components/PGdashboard/PGDashboardHome/certcontainer";
import AnnounContainer from "../../components/PGdashboard/PGDashboardHome/announcontainer";
import LogoutButton from "../../components/PGdashboard/Common/LogoutButton";

// API URL - This should come from a constants file or environment variable
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const HomePage = () => {
    const { authUser } = useAuth();
    const [certifications, setCertifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load user data, certifications, and announcements
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // If using real API, you'd fetch certifications using user ID
                // For now, using example data
                setCertifications([
                    {
                        name: "First Aid Certification",
                        expiryDate: "2025-12-31",
                        image: require("../../assets/images/firstaid.jpg"),
                    },
                    {
                        name: "Semenggoh Wildlife Centre Certification",
                        expiryDate: "2026-06-30",
                        image: require("../../assets/images/Semenggoh.jpeg"),
                    },
                ]);

                setAnnouncements([
                    {
                        title: "System Maintenance",
                        date: "2025-05-02",
                        description:
                            "The system will be down for maintenance from 2 AM to 4 AM.",
                        priority: "high", // Red circle
                    },
                    {
                        title: "New Feature Release",
                        date: "2025-05-01",
                        description:
                            "We are excited to announce a new feature coming soon!",
                        priority: "mid", // Orange circle
                    },
                    {
                        title: "Weekly Update",
                        date: "2025-04-30",
                        description:
                            "Here is your weekly update on system performance.",
                        priority: "low", // Green circle
                    },
                ]);

                // Example of how you would fetch from actual API:
                /*
                if (authUser && authUser.id) {
                    // Fetch certifications
                    try {
                        const certResponse = await axios.get(`${API_URL}/api/certifications/user/${authUser.id}`);
                        setCertifications(certResponse.data || []);
                    } catch (certError) {
                        if (certError.response && certError.response.status === 404) {
                            console.log("No certifications found for this guide");
                            setCertifications([]);
                        } else {
                            console.warn("Error fetching certifications:", certError.message);
                        }
                    }
                    
                    // Fetch announcements
                    try {
                        const announceResponse = await axios.get(`${API_URL}/api/announcements`);
                        setAnnouncements(announceResponse.data || []);
                    } catch (announceError) {
                        console.warn("Error fetching announcements:", announceError.message);
                        setAnnouncements([]);
                    }
                }
                */
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [authUser]);
    return (
        <Dashboard>
            <ProfileView
                fullName={authUser?.displayName || "John Doe"}
                guideId={authUser?.uid || "PG12345"}
                profilePhoto={require("../../assets/images/Ruiziq.jpg")}
            />
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading your data...</Text>
                </View>
            ) : (
                <>
                    <CertContainer certifications={certifications} />
                    <AnnounContainer announcements={announcements} />
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
        marginVertical: 10,
        width: "100%",
    },
    loadingText: {
        fontSize: 16,
        color: "#888",
        fontStyle: "italic",
        textAlign: "center",
    },
    logoutButton: {
        backgroundColor: "#e74c3c",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    logoutButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default HomePage;
