import React, { useState } from "react";
import { StyleSheet, LogBox } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);
import Dashboard from "../../components/PGdashboard/Common/Dashboard";
import ProfileView from "../../components/PGdashboard/PGDashboardHome/ProfileView";
import CertContainer from "../../components/PGdashboard/PGDashboardHome/certcontainer";
import AnnounContainer from "../../components/PGdashboard/PGDashboardHome/announcontainer";
import LogoutButton from "../../components/PGdashboard/Common/LogoutButton";

const HomePage = () => {
    const { authUser } = useAuth();

    // Example certifications data
    const certifications = [
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
    ];

    const announcements = [
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
            description: "Here is your weekly update on system performance.",
            priority: "low", // Green circle
        },
    ];

    return (
        <Dashboard>
            {/* Profile View */}
            <ProfileView
                fullName="John Doe"
                guideId="PG12345"
                profilePhoto={require("../../assets/images/Ruiziq.jpg")}
            />
            {/* Certifications Container */}
            <CertContainer certifications={certifications} />
            {/* Announcements Container */}
            <AnnounContainer announcements={announcements} />
            {/* Logout Button */}
            <LogoutButton />
        </Dashboard>
    );
};

const styles = StyleSheet.create({
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
