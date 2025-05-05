import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/PGdashboard/PGDashboardHome/Header";
import ProfileView from "../../../components/PGdashboard/PGDashboardHome/ProfileView";
import CertContainer from "../../../components/PGdashboard/PGDashboardHome/certcontainer";
import AnnounContainer from "../../../components/PGdashboard/PGDashboardHome/announcontainer";

const HomePage = () => {
    // Example certifications data
    const certifications = [
        {
            name: "First Aid Certification",
            expiryDate: "2025-12-31",
            image: require("../../../assets/images/firstaid.jpg"), // Updated path
        },
        {
            name: "Semenggoh Wildlife Centre Certification",
            expiryDate: "2026-06-30",
            image: require("../../../assets/images/Semenggoh.jpeg"), // Updated path
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
        <View style={{ flex: 1, backgroundColor: "rgb(22, 163, 74)" }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Header />

                {/* Dashboard Section */}
                <View
                    style={{
                        backgroundColor: "white",
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        marginTop: -5,
                        paddingBottom: 120,
                        zIndex: 1,
                        elevation: 10,
                        padding: 20,
                        flex: 1,
                    }}
                >
                    {/* Profile View */}
                    <ProfileView
                        fullName="John Doe"
                        guideId="PG12345"
                        profilePhoto={require("../../../assets/images/Ruiziq.jpg")} // Updated path
                    />

                    {/* Certifications Container */}
                    <CertContainer certifications={certifications} />

                    {/* Announcements Container */}
                    <AnnounContainer announcements={announcements} />
                </View>
            </ScrollView>
        </View>
    );
};

export default HomePage;
