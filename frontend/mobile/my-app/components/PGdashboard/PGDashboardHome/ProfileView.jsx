import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LogBox } from "react-native";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const ProfileView = ({ fullName, guideId, profilePhoto }) => {
    return (
        <View style={styles.container}>
            {profilePhoto ? (
                <Image source={profilePhoto} style={styles.profilePhoto} />
            ) : (
                <View style={[styles.profilePhoto, styles.noPhotoPlaceholder]}>
                    <Text style={styles.placeholderText}>
                        {fullName ? fullName.charAt(0).toUpperCase() : "PG"}
                    </Text>
                </View>
            )}
            <Text style={styles.fullName}>{fullName || "Unknown Guide"}</Text>
            <Text style={styles.guideId}>ID: {guideId || "Not Available"}</Text>
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
    noPhotoPlaceholder: {
        backgroundColor: "rgb(22, 163, 74)",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        fontSize: 40,
        fontWeight: "bold",
        color: "white",
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
