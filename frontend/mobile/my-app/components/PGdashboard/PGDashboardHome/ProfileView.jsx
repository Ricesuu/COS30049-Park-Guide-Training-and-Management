import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ProfileView = ({ fullName, guideId, profilePhoto }) => {
    return (
        <View style={styles.container}>
            {/* Profile Photo */}
            <Image source={profilePhoto} style={styles.profilePhoto} />

            {/* Full Name */}
            <Text style={styles.fullName}>{fullName}</Text>

            {/* Park Guide ID */}
            <Text style={styles.guideId}>ID: {guideId}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    fullName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    guideId: {
        fontSize: 14,
        color: "#666",
    },
});

export default ProfileView;