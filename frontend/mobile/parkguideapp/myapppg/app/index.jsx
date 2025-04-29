import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/PGDashboardHome/Header";
import ProfileView from "../components/PGDashboardHome/ProfileView"; // Import ProfileView
import CertContainer from "../components/PGDashboardHome/certcontainer"; // Import CertContainer

const HomePage = () => {
    // Example certifications data
    const certifications = [
        {
            name: "First Aid Certification",
            expiryDate: "2025-12-31",
            image: require("../assets/images/firstaid.jpg"), // Use require for local images
        },
        {
            name: "Semenggoh Wildlife Centre Certification",
            expiryDate: "2026-06-30",
            image: require("../assets/images/Semenggoh.jpeg"), // Use require for local images
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
                        profilePhoto={require("../assets/images/Ruiziq.jpg")} // Use require for the image
                    />

                    {/* Certifications Container */}
                    <CertContainer certifications={certifications} />
                </View>
            </ScrollView>
        </View>
    );
};

export default HomePage;
